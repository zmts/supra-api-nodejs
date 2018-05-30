const Joi = require('joi')

const securityModule = require('../services/security')
const queryResolverService = require('../services/queryResolverService')

/**
 * @description base action
 */
class BaseAction {
  /**
   * ------------------------------
   * @BASE_CONFIGS
   * ------------------------------
   */
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
      // headers: Joi.object({ // TODO make required Content-Type as application/json
      //   'Content-Type': Joi.string().required()
      // })
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

  static queryResolver (config) {
    __typecheck(config, 'Object', true)

    return queryResolverService(config)
  }

  /**
   * ------------------------------
   * @BASE_SECURITY_SERVICES
   * ------------------------------
   */

  // use with all actions by default
  static checkAccessByTag (accessTag) {
    __typecheck(accessTag, 'String', true)

    return securityModule.checkAccessByTagService(accessTag)
  }

  // use with PATCH, DELETE
  static checkAccessByOwnerId (model) {
    __typecheck(model, 'Object', true)

    return securityModule.checkAccessByOwnerIdService(model)
  }

  // use with GET
  static checkAccessToPrivateItem (model) {
    __typecheck(model, 'Object', true)

    return securityModule.checkAccessToPrivateItem(model)
  }
}

module.exports = BaseAction
