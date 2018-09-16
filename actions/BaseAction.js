const Joi = require('joi')
const JoiToJsonSchema = require('joi-to-json-schema')

const securityModule = require('../services/security')
const queryResolverService = require('../services/queryResolverService')
const ResponseJson = require('./ResponseJson')
const { currentUser } = require('../registry')

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
        q: Joi.string().min(2).max(50),
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().valid([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
        orderBy: Joi.string().valid(['createdAt:asc', 'createdAt:desc'])
      })
      // headers: Joi.object({ // TODO make required Content-Type as application/json
      //   'Content-Type': Joi.string().required()
      // })
    }
  }

  static get jsonSchema () {
    return JoiToJsonSchema(this.validationRules.body)
  }

  static get currentUser () {
    return currentUser.user
  }

  /**
   * ------------------------------
   * @BASE_METHODS
   * ------------------------------
   */

  static resJson (options = {}) {
    __typecheck(options, __type.object, true)

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

  static queryResolver (reqQuery, defaultConfig) {
    __typecheck(reqQuery, 'Object', true)
    __typecheck(defaultConfig, 'Object', true)

    return queryResolverService(reqQuery, defaultConfig)
  }

  /**
   * ------------------------------
   * @BASE_SECURITY_SERVICES
   * ------------------------------
   */

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
