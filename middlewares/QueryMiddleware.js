const { BaseMiddleware } = require('supra-core')
const logger = require('../logger')

class QueryMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return async (req, res, next) => {
      // set default query
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
    }
  }
}

module.exports = { QueryMiddleware }
