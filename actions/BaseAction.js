const joi = require('@hapi/joi')
const { Rule, RequestRule, assert } = require('supra-core')

class BaseAction {
  static get joi () {
    return joi
  }

  static get baseQueryParams () {
    return {
      page: new RequestRule(new Rule({
        validator: v => Number.isInteger(v) && v >= 0,
        description: 'Number; min 0;'
      })),
      limit: new RequestRule(new Rule({
        validator: v => Number.isInteger(v) && [4, 6, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(v),
        description: 'Number; One of: [4, 6, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]'
      })),
      orderBy: new RequestRule(new Rule({
        validator: v => joi.validate(v, {
          field: joi.string().valid(['createdAt']),
          direction: joi.string().valid(['asc', 'desc'])
        }, e => e ? e.message : true),
        description: 'Object; { field: string, direction: asc || desc }'
      })),
      filter: new RequestRule(new Rule({
        validator: v => joi.validate(v, joi.object().keys({}), e => e ? e.message : true),
        description: 'Object;'
      })),
      schema: new RequestRule(new Rule({
        validator: v => typeof v === 'boolean',
        description: 'Boolean;'
      }))
    }
  }

  static result (result) {
    assert.object(result, { notEmpty: true })
    assert.boolean(result.success)
    assert.integer(result.status)
    assert.object(result.headers)
    assert.string(result.message)
    assert.isOk(result.data)

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
