const pino = require('pino')
const config = require('../config')
const { SentryCatch, Logger, assert } = require('supra-core')
const sentry = new SentryCatch(config.app.sentryDns)

const fatalLogger = pino({
  name: `${config.app.name.toLowerCase()}::fatal`,
  errorLikeObjectKeys: ['err', 'error'],
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const errorLogger = pino({
  name: `${config.app.name.toLowerCase()}::error`,
  errorLikeObjectKeys: ['err', 'error'],
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const warnLogger = pino({
  name: `${config.app.name.toLowerCase()}::warn`,
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const infoLogger = pino({
  name: `${config.app.name.toLowerCase()}::info`,
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})

const traceLogger = pino({
  name: `${config.app.name.toLowerCase()}::trace`,
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})

const loggers = {
  /**
   * error loggers
   */

  fatal: (message, error, meta) => {
    assert.string(message, { required: true })
    assert.isOk(error, { required: true })
    assert.object(meta)

    sentry.captureException(error, meta)
    fatalLogger.fatal(message, meta || error.toString())
  },

  error: (message, error, meta) => {
    assert.string(message, { required: true })
    assert.isOk(error, { required: true })
    assert.object(meta)

    sentry.captureException(error, meta)
    errorLogger.error(message, meta || error.toString())
  },

  warn: (message, error, meta) => {
    assert.string(message, { required: true })
    assert.isOk(error, { required: true })
    assert.object(meta)

    sentry.captureException(error, meta)
    warnLogger.warn(message, meta || error.toString())
  },

  /**
   * system info loggers
   */

  trace: (message, meta) => {
    assert.string(message, { required: true })
    assert.object(meta)

    sentry.captureMessage(message, meta)
    traceLogger.info(message, meta || '')
  },

  info: (message, meta = {}) => {
    assert.string(message, { required: true })
    assert.isOk(meta)

    infoLogger.info(message, Object.keys(meta).length ? meta : '')
  }
}

module.exports = new Logger(loggers)

