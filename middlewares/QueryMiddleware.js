const joi = require('joi')
const BaseMiddleware = require('../core/BaseMiddleware')

const querySchema = joi.object({
  q: joi.string().min(2).max(50),
  page: joi.number().integer().min(1),
  limit: joi.number().integer().valid([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
  orderBy: joi.string().valid(['createdAt:asc', 'createdAt:desc']),
  filter: joi.object(),
  schema: joi.boolean()
})

const headersSchema = joi.object({
  'content-type': joi.string().valid('application/json', 'multipart/form-data').required()
}).options({ allowUnknown: true })

// const paramsSchema = joi.object().keys({
// //   id: joi.number().integer()
// // })

class QueryMiddleware extends BaseMiddleware {
  async init () {
    __logger.info('QueryMiddleware initialized ...')
  }

  handler () {
    return async (req, res, next) => {
      try {
        await joi.validate(req.query, querySchema)
        await joi.validate(req.headers, headersSchema)

        req.query = {
          ...req.query,
          page: Number(req.query.page) || 0,
          limit: Number(req.query.limit) || 10,
          filter: req.query.filter || {},
          orderBy: req.query.orderBy || { field: 'createdAt', direction: 'asc' }
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  }
}

module.exports = new QueryMiddleware()
