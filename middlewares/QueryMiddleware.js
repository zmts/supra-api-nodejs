const joi = require('@hapi/joi')
const { BaseMiddleware } = require('supra-core')

const headersSchema = joi.object({
  'content-type': joi.string().valid('application/json', 'multipart/form-data').required()
}).options({ allowUnknown: true })

class QueryMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return async (req, res, next) => {
      try {
        await joi.validate(req.headers, headersSchema)

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
