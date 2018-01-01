const Joi = require('joi')
const _ = require('lodash')

const { ErrorWrapper } = require('../util/error')

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

/**
 * @description base action
 */
class BaseAction {
  /* example run method
  run (req, res, next) {
    this.checkAccess(req, this.permissions)
      .then(() => this.validate(req, this.validationRules))
      .then(() => res.json({ data: 'base action, needs to be redefined' }))
      .catch(error => next(error))
  } */

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
   * @description check action permissions
   * @param user
   * @param permissions
   */
  checkAccess (user, permissions) {
    return new Promise((resolve, reject) => {
      if (user.isOwner) return resolve()
      if (permissions[user.role]) return resolve()
      return reject(new ErrorWrapper('Access denied', 403))
    })
  }

  /**
   * @description check is logged in user status
   * @param user
   */
  isLoggedIn (user) {
    return new Promise((resolve, reject) => {
      if (user.id) return resolve()
      return reject(new ErrorWrapper('Anonymous user. Access denied', 403))
    })
  }

  /**
   * @description validate request
   * @param req
   * @param rules
   */
  validate (req, rules) {
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
}

module.exports = BaseAction
