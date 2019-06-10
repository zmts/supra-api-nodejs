const joi = require('@hapi/joi')

class BaseAction {
  static get joi () {
    return joi
  }

  static get baseQueryParams () {
    return {
      q: joi.string().min(2).max(50),
      page: joi.number().integer().min(0),
      limit: joi.number().integer().valid([4, 6, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
      orderBy: {
        field: joi.string(),
        direction: joi.string().valid(['asc', 'desc'])
      },
      filter: joi.object(),
      schema: joi.boolean()
    }
  }

  static result (result) {
    __typecheck(result, __type.object, true)
    __typecheck(result.success, __type.boolean)
    __typecheck(result.status, __type.number)
    __typecheck(result.headers, __type.object)
    __typecheck(result.message, __type.string)
    __typecheck(result.data, __type.any)

    return {
      success: result.success || true,
      status: result.status || 200,
      ...(result.headers && { headers: result.headers }),
      ...(result.message && { message: result.message }),
      ...(result.data && { data: result.data })
    }
  }
}

module.exports = BaseAction
