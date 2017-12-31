const Joi = require('joi')
const _ = require('lodash')

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
class Base {
  basePermissions () {
    return {
      anonymous: false
    }
  }

  baseValidationRules () {
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
   * @description example run method, needs to be redefined in each action
   * @param req
   * @param res
   * @param next
   */
  run (req, res, next) {
    this.validate(req, this.validationRules())
      .then(() => res.json({ data: 'base action, needs to be redefined' }))
      .catch(error => next(error))
  }

  /**
   * @description check action permissions
   * @param permissions
   */
  checkPermissions (permissions) {
    console.log(permissions)
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

module.exports = Base
