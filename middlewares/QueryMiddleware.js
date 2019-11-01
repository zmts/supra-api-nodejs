const { BaseMiddleware, ErrorWrapper, errorCodes } = require('supra-core')
const logger = require('../logger')

class QueryMiddleware extends BaseMiddleware {
  async init () {
    logger.trace(`${this.constructor.name} initialized...`)
  }

  handler () {
    return async (req, res, next) => {
      try {
        // validate content-type
        const contentType = req.headers['Content-Type'] || req.headers['content-type']
        if (!contentType || !['application/json', 'multipart/form-data'].includes(contentType)) {
          throw new ErrorWrapper({ ...errorCodes.BAD_REQUEST, message: 'Invalid content type' })
        }

        // get method default query
        req.query = req.method === 'GET' ? {
          ...req.query,
          page: Number(req.query.page) || 0,
          limit: Number(req.query.limit) || 10,
          filter: req.query.filter || {},
          orderBy: {
            ...((req.query.orderBy && req.query.orderBy.field && { field: req.query.orderBy.field }) || { field: 'createdAt' }),
            ...((req.query.orderBy && req.query.orderBy.direction && { direction: req.query.orderBy.direction }) || { direction: 'asc' })
          }
        } : { ...req.query }

        next()
      } catch (error) {
        next(error)
      }
    }
  }
}

module.exports = new QueryMiddleware()
