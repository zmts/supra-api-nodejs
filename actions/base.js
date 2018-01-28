const Joi = require('joi')
const _ = require('lodash')

const ErrorWrapper = require('../util/error')
const securityServices = require('../services/security')

/*
request flow:
sanitize(in global middleware) >>

run (req, res, next) {
  return this.checkPermissions(this.permissions)
    .then(() => this.validate(this.validationRules()))
    .then(() => {
      // some process with data and response to client
    }).catch(error => next(error))
}
*/

/*
example run method
run (req, res, next) {
  this.checkAccess(req, this.permissions)
    .then(() => this.validate(req, this.validationRules))
    .then(() => res.json({ data: 'base action, needs to be redefined' }))
    .catch(error => next(error))
}
*/

/**
 * @description base action
 */
class BaseAction {
  /**
   * ------------------------------
   * @BASE_CONFIGS
   * ------------------------------
   */

  get basePermissions () {
    return {
      anonymous: false
    }
  }

  get baseValidationRules () {
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
   * @param {Object} req
   * @param {Object} rules
   */
  validate (req, rules) {
    if (!req) throw new ErrorWrapper('\'validate\' method requires \'req\' param', 500)
    if (!rules) throw new ErrorWrapper('\'validate\' method requires \'rules\' param', 500)

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

  checkAccess (user, permissions) {
    return securityServices.checkAccess(user, permissions)
  }

  isLoggedIn (user) {
    return securityServices.isLoggedIn(user)
  }
}

module.exports = BaseAction
