const pino = require('pino')

const fatalLogger = pino({
  name: 'api.fatal',
  errorLikeObjectKeys: ['err', 'error'],
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const errorLogger = pino({
  name: 'api.error',
  errorLikeObjectKeys: ['err', 'error'],
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const warnLogger = pino({
  name: 'api.warn',
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const infoLogger = pino({
  name: 'api.info',
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
