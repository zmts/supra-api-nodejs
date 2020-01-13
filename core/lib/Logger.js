const { Assert: assert } = require('./assert')
const { SentryCatch } = require('./SentryCatch')
const { AbstractLogger, getMetadata } = require('./AbstractLogger')
const pino = require('pino')
// const serializers = require('pino-std-serializers')

const $ = Symbol('private scope')

class Logger extends AbstractLogger {
  constructor ({ appName, capture = false, sentryDns, raw = false } = {}) {
    super()

    assert.string(appName, { required: true })
    assert.boolean(capture)
    assert.string(sentryDns)

    if (capture && !sentryDns) {
      throw new Error(`${this.constructor.name}: Please define 'sentryDns' param`)
    }

    this[$] = {
      sentryCatch: capture ? new SentryCatch(sentryDns) : null,

      fatalLogger: pino({
        name: `${appName.toLowerCase()}::fatal`,
        errorLikeObjectKeys: ['err', 'error'],
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } })
      }),
      errorLogger: pino({
        name: `${appName.toLowerCase()}::error`,
        errorLikeObjectKeys: ['err', 'error'],
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } })
      }),
      warnLogger: pino({
        name: `${appName.toLowerCase()}::warn`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } })
      }),
      infoLogger: pino({
        name: `${appName.toLowerCase()}::info`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } })
      }),
      debugLogger: pino({
        level: 20,
        name: `${appName.toLowerCase()}::debug`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } })
      }),
      traceLogger: pino({
        level: 10,
        name: `${appName.toLowerCase()}::trace`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } })
      })
    }
  }

  _captureException (error, meta) {
    if (this[$].sentryCatch) this[$].sentryCatch.captureException(error, meta)
  }

  _captureMessage (message, meta) {
    if (this[$].sentryCatch) this[$].sentryCatch.captureMessage(message, meta)
  }

  fatal (message, error, meta) {
    assert.string(message, { required: true })
    assert.isOk(error, { required: true })
    assert.object(meta)

    this._captureException(error, meta)
    this[$].fatalLogger.fatal(message, meta || error.toString())
  }

  error (message, error, meta) {
    assert.string(message, { required: true })
    assert.isOk(error, { required: true })
    assert.object(meta)

    this._captureException(error, meta)
    this[$].errorLogger.error(message, meta || error.toString())
  }

  warn (message, error, meta) {
    assert.string(message, { required: true })
    assert.isOk(error, { required: true })
    assert.object(meta)

    this._captureException(error, meta)
    this[$].warnLogger.warn(message, meta || error.toString())
  }

  info (message, meta) {
    assert.string(message, { required: true })
    assert.isOk(meta)

    this._captureMessage(message, meta)
    this[$].infoLogger.info(message, getMetadata(meta))
  }

  debug (message, meta) {
    assert.string(message, { required: true })
    assert.isOk(meta)

    this[$].debugLogger.debug(message, getMetadata(meta))
  }

  trace (message, meta) {
    assert.string(message, { required: true })
    assert.isOk(meta)

    this[$].traceLogger.trace(message, getMetadata(meta))
  }
}

module.exports = { Logger }
