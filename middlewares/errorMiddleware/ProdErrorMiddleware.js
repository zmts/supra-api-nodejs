const stackTrace = require('stack-trace')
const ErrorResponse = require('./ErrorResponse')
const { errorCodes, BaseMiddleware } = require('supra-core')
const logger = require('../../logger')

class ProdErrorMiddleware extends BaseMiddleware {
  async init () {
    logger.trace(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (error, req, res, next) => {
      if (error.status === 404) {
        const errorRes = new ErrorResponse({
          ...error,
          env: 'prod/regular'
        })

        res.status(errorRes.status).json(errorRes)
      } else if (error.isJoi) {
        const errorRes = new ErrorResponse({
          valid: false,
          message: error.message || error.details[0].message,
          code: errorCodes.VALIDATION.code,
          key: error.details[0].context.key,
          status: error.status || 400,
          env: 'prod/regular'
        })

        logger.error(errorRes.message, error, { ...errorRes })
        res.status(errorRes.status).json(errorRes)
      } else {
        const errorRes = new ErrorResponse({
          ...error,
          message: error.message || error,
          code: error.code || errorCodes.SERVER.code,
          status: error.status || errorCodes.SERVER.status,
          stack: ![400, 401, 403, 422].includes(error.status) ? stackTrace.parse(error) : false,
          env: 'prod/regular'
        })

        logger.error(errorRes.message, error, { ...errorRes, req: error.req, meta: error.meta })
        delete errorRes.stack
        res.status(errorRes.status).json(errorRes)
      }
    }
  }
}

module.exports = new ProdErrorMiddleware()

