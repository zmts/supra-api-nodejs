const pino = require('pino')

const { Assert: assert } = require('./assert')
const { ValidatorNano: validator } = require('./validator/ValidatorNano')
const { SentryCatch } = require('./SentryCatch')
const { AbstractLogger } = require('./AbstractLogger')

const $ = Symbol('private scope')

class Logger extends AbstractLogger {
  constructor ({ appName, capture = false, sentryDsn, raw = false } = {}) {
    super()

    assert.string(appName, { required: true })
    assert.boolean(capture)
    assert.string(sentryDsn)

    if (capture && !sentryDsn) {
      throw new Error(`${this.constructor.name}: Please define 'sentryDsn' param`)
    }

    this[$] = {
      sentryCatch: capture ? new SentryCatch(sentryDsn) : null,

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

  /**
   * ------------------------------
   * @PRIVATE_HELPERS
   * ------------------------------
   */

  _captureException (error, payload) {
    if (this[$].sentryCatch) this[$].sentryCatch.captureException(error, payload)
  }

  _captureMessage (message, payload) {
    if (this[$].sentryCatch) this[$].sentryCatch.captureMessage(message, payload)
  }

  /**
   * ------------------------------
   * @ERROR_METHODS
   * ------------------------------
   */

  fatal (message, error, meta) {
    assert.string(message, { required: true })
    assert.ok(error, { required: true })
    assert.ok(meta)

    const payload = validator.isObject(meta) ? { ...error, ...meta } : { ...error, meta }

    this._captureException(error, payload)
    this[$].fatalLogger.fatal(payload, message)
  }

  error (message, error, meta) {
    assert.string(message, { required: true })
    assert.ok(error, { required: true })
    assert.ok(meta)

    const payload = validator.isObject(meta) ? { ...error, ...meta } : { ...error, meta }

    this._captureException(error, payload)
    this[$].errorLogger.error(payload, message)
  }

  warn (message, error, meta) {
    assert.string(message, { required: true })
    assert.ok(error, { required: true })
    assert.ok(meta)

    const payload = validator.isObject(meta) ? { ...error, ...meta } : { ...error, meta }

    this._captureException(error, payload)
    this[$].warnLogger.warn(payload, message)
  }

  /**
   * ------------------------------
   * @INFO_METHODS
   * ------------------------------
   */

  info (message, meta) {
    assert.string(message, { required: true })
    assert.ok(meta)

    const payload = validator.isObject(meta) ? meta : { meta }

    this._captureMessage(message, payload)
    this[$].infoLogger.info(payload, message)
  }

  debug (message, meta) {
    assert.string(message, { required: true })
    assert.ok(meta)

    const payload = validator.isObject(meta) ? meta : { meta }

    this[$].debugLogger.debug(payload, message)
  }

  trace (message, meta) {
    assert.string(message, { required: true })
    assert.ok(meta)

    const payload = validator.isObject(meta) ? meta : { meta }

    this[$].traceLogger.trace(payload, message)
  }
}

module.exports = { Logger }
