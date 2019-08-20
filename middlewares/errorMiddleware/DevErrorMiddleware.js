const chalk = require('chalk')
const stackTrace = require('stack-trace')
const ErrorResponse = require('./ErrorResponse')
const BaseMiddleware = require('../../core/BaseMiddleware')
const { errorCodes } = require('../../config')

class DevErrorMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (error, req, res, next) => {
      if (error.status === 404) {
        const errorRes = new ErrorResponse({
          ...error,
          env: 'dev/regular'
        })

        res.status(errorRes.status).json(errorRes)
      } else if (error.isJoi) {
        const errorRes = new ErrorResponse({
          valid: false,
          message: error.message || error.details[0].message,
          code: errorCodes.VALIDATION.code,
          key: error.details[0].context.key,
          status: error.status || 400,
          env: 'dev/regular'
        })

        __logger.error(errorRes.message, error, { ...errorRes })
        res.status(errorRes.status).json(errorRes)
      } else {
        const errorRes = new ErrorResponse({
          ...error,
          code: error.code || errorCodes.SERVER.code,
          status: error.status || errorCodes.SERVER.status,
          message: error.message || error,
          stack: ![400, 401, 403, 422].includes(error.status) ? stackTrace.parse(error) : false,
          env: 'dev/regular'
        })

        __logger.error(errorRes.message, error, { ...errorRes, req: error.req, meta: error.meta })
        res.status(errorRes.status).json(errorRes)
      }

      if (error.stack) {
        console.log(chalk.red('--------------- ERROR STACK BEGIN --------------'))
        console.log(chalk.red(`${new Date()} env:dev/regular error`))
        console.log(chalk.blue(error.stack))
        console.log(chalk.red('---------------- ERROR STACK END ---------------'))
      }
    }
  }
}

module.exports = new DevErrorMiddleware()

