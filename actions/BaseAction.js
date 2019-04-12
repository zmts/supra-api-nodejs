const joi = require('joi')
const JoiToJsonSchema = require('joi-to-json-schema')

/**
 * @description base action
 */
class BaseAction {
  static get baseQueryParams () {
    return {
      q: joi.string().min(2).max(50),
      page: joi.number().integer().min(0),
      limit: joi.number().integer().valid([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
      orderBy: {
        field: joi.string(),
        direction: joi.string().valid(['asc', 'desc'])
      },
      filter: joi.object(),
      schema: joi.boolean()
    }
  }

  static get jsonSchema () {
    if (this.validationRules.body) {
      return JoiToJsonSchema(this.validationRules.body)
    }
    return JoiToJsonSchema(joi.object().keys(this.validationRules))
  }

  /**
   * ------------------------------
   * @BASE_METHODS
   * ------------------------------
   */

  static resJson (options) {
    return {
      success: options.success || true,
      data: options.data || undefined,
      message: options.message || undefined
    }
  }

  /**
   * @description validate request
   * uses by default in init method
   */
  static validate (req, rules) {
    __typecheck(req, 'Object', true)
    __typecheck(rules, 'Object', true)

    // map list of validation schemas
    let validationSchemas = Object.keys(rules).map(key => {
      return joi.validate(req[key], rules[key])
    })

    // execute validation
    return new Promise((resolve, reject) => {
      Promise.all(validationSchemas)
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }
}

module.exports = BaseAction
