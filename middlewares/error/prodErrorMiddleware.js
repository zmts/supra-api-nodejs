const stackTrace = require('stack-trace')
const ErrorResponse = require('./ErrorResponse')

module.exports = (error, req, res, next) => {
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
      code: error.details[0].type,
      key: error.details[0].context.key,
      env: 'prod/regular'
    })

    __logger.error(errorRes.message, errorRes)
    res.status(400).json(errorRes)
  } else {
    const errorRes = new ErrorResponse({
      ...error,
      message: error.message || error,
      stack: ![401, 403].includes(error.status) ? stackTrace.parse(error) : false,
      env: 'prod/regular'
    })

    __logger.error(errorRes.message, { ...errorRes, req: error.req, meta: error.meta })
    delete errorRes.stack
    res.status(error.status || 500).json(errorRes)
  }
}
