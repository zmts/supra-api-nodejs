const Joi = require('joi')
const JoiToJsonSchema = require('joi-to-json-schema')

const securityModule = require('../services/security')
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
      return Joi.validate(req[key], rules[key])
    })

    // execute validation
    return new Promise((resolve, reject) => {
      Promise.all(validationSchemas)
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  /**
   * ------------------------------
   * @BASE_SECURITY_SERVICES
   * ------------------------------
   */

  static checkAccessByTag (accessTag, currentUser) {
    __typecheck(accessTag, 'String', true)
    __typecheck(currentUser, __type.object, true)

    return securityModule.checkAccessByTagService(accessTag, currentUser)
  }

  // use with PATCH, DELETE
  static checkAccessByOwnerId (model, currentUser) {
    __typecheck(model, 'Object', true)
    __typecheck(currentUser, __type.object, true)

    return securityModule.checkAccessByOwnerIdService(model, currentUser)
  }

  // use with GET
  static checkAccessToPrivateItem (model, currentUser) {
    __typecheck(model, 'Object', true)
    __typecheck(currentUser, __type.object, true)

    return securityModule.checkAccessToPrivateItem(model, currentUser)
  }
}

module.exports = BaseAction
