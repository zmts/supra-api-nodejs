const pino = require('pino')

const dangerLogger = pino({
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

module.exports = ({ message, log = '', type }) => {
  __typecheck(message, __type.string, true)

  switch (type) {
    case 'fatal':
      dangerLogger.fatal(message, log)
      break
    case 'error':
      errorLogger.error(message, log)
      break
    case 'warn':
      warnLogger.warn(message, log)
      break
    default:
      infoLogger.info(message, log)
      break
  }
}
