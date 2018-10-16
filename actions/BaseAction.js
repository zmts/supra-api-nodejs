const joi = require('joi')
const JoiToJsonSchema = require('joi-to-json-schema')

const ResponseJson = require('./ResponseJson')

/**
 * @description base action
 */
class BaseAction {
  static get jsonSchema () {
    return JoiToJsonSchema(this.validationRules.body)
  }

  /**
   * ------------------------------
   * @BASE_METHODS
   * ------------------------------
   */

  static resJson (options) {
    return new ResponseJson(options)
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
