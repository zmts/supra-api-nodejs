const pino = require('pino')
const config = require('../config')

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

module.exports = {
  fatal: (message, log = '') => {
    __typecheck(message, __type.string, true)
    fatalLogger.fatal(message, log instanceof Error ? log.toString() : log)
  },

  error: (message, log = '') => {
    __typecheck(message, __type.string, true)
    errorLogger.error(message, log instanceof Error ? log.toString() : log)
  },

  warn: (message, log = '') => {
    __typecheck(message, __type.string, true)
    warnLogger.warn(message, log instanceof Error ? log.toString() : log)
  },

  info: (message, log = '') => {
    __typecheck(message, __type.string, true)
    infoLogger.info(message, log instanceof Error ? log.toString() : log)
  }
}
