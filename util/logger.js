const pino = require('pino')

const fatalLogger = pino({
  name: 'fatal',
  errorLikeObjectKeys: ['err', 'error'],
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const errorLogger = pino({
  name: 'error',
  errorLikeObjectKeys: ['err', 'error'],
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const warnLogger = pino({
  name: 'warn',
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})
const infoLogger = pino({
  name: 'info',
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})

module.exports = {
  fatal: (message, log = null) => {
    __typecheck(message, __type.string, true)
    fatalLogger.fatal(message, log)
  },

  error: (message, log = null) => {
    __typecheck(message, __type.string, true)
    errorLogger.error(message, log)
  },

  warn: (message, log = null) => {
    __typecheck(message, __type.string, true)
    warnLogger.warn(message, log)
  },

  info: (message, log = null) => {
    __typecheck(message, __type.string, true)
    infoLogger.info(message, log)
  }
}
