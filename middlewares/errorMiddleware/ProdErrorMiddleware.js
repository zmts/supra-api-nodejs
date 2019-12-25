const ErrorResponse = require('./ErrorResponse')
const { errorCodes, BaseMiddleware } = require('supra-core')
const logger = require('../../logger')

class ProdErrorMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (error, req, res, next) => {
      if (error.status === 404) {
        const errorRes = new ErrorResponse({
          ...error,
          src: `${process.env.NODE_ENV}:err:middleware`
        })

        res.status(errorRes.status).json(errorRes)
      } else {
        const errorRes = new ErrorResponse({
          ...error,
          message: error.message || error,
          code: error.code || errorCodes.SERVER.code,
          status: error.status || errorCodes.SERVER.status,
          src: `${process.env.NODE_ENV}:err:middleware`
        })

        // log only significant errors
        if (![400, 401, 403, 422].includes(error.status)) {
          logger.error(errorRes.message, error, { ...errorRes, req: error.req, meta: error.meta })
        }
        delete errorRes.stack
        res.status(errorRes.status).json(errorRes)
      }
    }
  }
}

module.exports = new ProdErrorMiddleware()

