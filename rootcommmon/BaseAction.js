const joi = require('joi')
const { Rule, RequestRule, assert } = require('supra-core')

class BaseAction {
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
        validator: v => {
          const result = joi.object({
            field: joi.string().valid('createdAt'),
            direction: joi.string().valid('asc', 'desc')
          }).validate(v)
          return result.error && result.error.message || true
        },
        description: 'Object; { field: string, direction: asc || desc }'
      })),
      filter: new RequestRule(new Rule({
        validator: v => typeof v === 'object',
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
    assert.array(result.cookies)
    assert.object(result.headers)
    assert.string(result.message)
    assert.ok(result.data)

    return {
      success: result.success || true,
      status: result.status || 200,
      ...(result.cookies && { cookies: result.cookies }),
      ...(result.headers && { headers: result.headers }),
      ...(result.message && { message: result.message }),
      ...(result.data && { data: result.data })
    }
  }

  static redirect (options) {
    assert.object(options, { required: true })
    assert.url(options.url, { required: true })
    assert.integer(options.code)

    return {
      redirect: {
        status: options.status || 301,
        url: options.url
      }
    }
  }
}

module.exports = { BaseAction }
