const joi = require('joi')
const querySchema = joi.object().keys({
  q: joi.string().min(2).max(50),
  page: joi.number().integer().min(1),
  limit: joi.number().integer().valid([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
  orderBy: joi.string().valid(['createdAt:asc', 'createdAt:desc']),
  filter: joi.object()
})

// const headersSchema = joi.object({ // TODO make required Content-Type as application/json
//   'Content-Type': joi.string().required()
// })

// const paramsSchema = joi.object().keys({
//   id: joi.number().integer()
// })

module.exports = async (req, res, next) => {
  try {
    await joi.validate(req.query, querySchema)
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
