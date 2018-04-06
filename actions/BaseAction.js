const Joi = require('joi')
const _ = require('lodash')

const securityServices = require('../services/security')

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
        id: Joi.number().integer()
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
    const validationSchemas = _.map(rules, (rulesSchema, key) => {
      return Joi.validate(req[key], rulesSchema)
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

    return securityServices.checkAccess(user, permissions)
  }

  static isLoggedIn (user) {
    __typecheck(user, 'Object', true)

    return securityServices.isLoggedIn(user)
  }
}

module.exports = BaseAction
