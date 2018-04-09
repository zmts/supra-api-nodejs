const Joi = require('joi')

const securityModule = require('../services/security')

/**
 * @description base action
 */
class BaseAction {
  /**
   * ------------------------------
   * @BASE_CONFIGS
   * ------------------------------
   */

  static get basePermissions () {
    return {
      anonymous: false
    }
  }

  static get baseValidationRules () {
    return {
      params: Joi.object().keys({
        id: Joi.number().integer()
      }),
      query: Joi.object().keys({
        q: Joi.string().min(2).max(50)
      }),
      body: Joi.object().keys({
        id: Joi.any().forbidden()
      })
    }
  }

  /**
   * ------------------------------
   * @BASE_METHODS
   * ------------------------------
   */

  /**
   * @description validate request
   */
  static validate (req, rules) {
    __typecheck(req, 'Object', true)
    __typecheck(rules, 'Object', true)

    // map list of validation schemas
    const validationSchemas = Array.prototype.map.call(rules, (schema, key) => {
      return Joi.validate(req[key], schema)
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

  static checkAccess (user, permissions) {
    __typecheck(user, 'Object', true)
    __typecheck(permissions, 'Object', true)

    return securityModule.checkAccessService(user, permissions)
  }

  static isLoggedIn (user) {
    __typecheck(user, 'Object', true)

    return securityModule.isLoggedInService(user)
  }
}

module.exports = BaseAction
