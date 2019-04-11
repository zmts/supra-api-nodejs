const stackTrace = require('stack-trace')
const ErrorResponse = require('./ErrorResponse')
const BaseMiddleware = require('../../core/BaseMiddleware')
const { errorCodes } = require('../../config')

class ProdErrorMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (error, req, res, next) => {
      if (error.status === 404) {
        const errorRes = new ErrorResponse({
          ...error,
          env: 'prod/regular'
        })

        res.status(404).json(errorRes)
      } else if (error.isJoi) {
        const errorRes = new ErrorResponse({
          valid: false,
          message: error.details[0].message,
          code: errorCodes.VALIDATION.code,
          key: error.details[0].context.key,
          env: 'prod/regular'
        })

        __logger.error(errorRes.message, errorRes)
        res.status(400).json(errorRes)
      } else {
        const errorRes = new ErrorResponse({
          ...error,
          message: error.message || error,
          stack: ![400, 401, 403].includes(error.status) ? stackTrace.parse(error) : false,
          env: 'prod/regular'
        })

        __logger.error(errorRes.message, { ...errorRes, req: error.req, meta: error.meta })
        delete errorRes.stack
        res.status(error.status || 500).json(errorRes)
      }
    }
  }
}

module.exports = new ProdErrorMiddleware()

