const joi = require('joi')
const JoiToJsonSchema = require('joi-to-json-schema')
const { checkAccessByTagService } = require('../services/security')

class BaseRouter {
  async init () {
    throw new Error(`${this.constructor.name} should implement 'init' method.`)
  }

  get router () {
    throw new Error(`${this.constructor.name} should implement 'router' getter.`)
  }

  actionRunner (action) {
    __typecheck(action, 'Function', true)

    if (!action.hasOwnProperty('accessTag')) {
      throw new Error(`'accessTag' getter not declared in invoked '${action.name}' action`)
    }

    if (!action.hasOwnProperty('run')) {
      throw new Error(`'run' method not declared in invoked '${action.name}' action`)
    }

    return async (req, res, next) => {
      __typecheck(req, __type.object, true)
      __typecheck(res, __type.object, true)
      __typecheck(next, __type.function, true)

      try {
        /**
         * returns request schema
         */
        if (action.validationRules && req.query.schema && ['POST', 'PATCH', 'GET'].includes(req.method)) {
          return res.json(JoiToJsonSchema(joi.object().keys(action.validationRules)))
        }

        /**
         * check access to action by access tag
         */
        await checkAccessByTagService(action.accessTag, req.currentUser)

        /**
         * validate action custom rules
         */
        if (action.validationRules) {
          await action.validate(req, action.validationRules)
        }

        /**
         * fire action with req, res, next args
         */
        await action.run(req, res, next)
      } catch (error) {
        error.req = {
          user: req.currentUser,
          ip: req.ip,
          headers: req.headers,
          body: req.body,
          params: req.params,
          query: req.query,
          url: req.url,
          method: req.method
        }
        next(error)
      }
    }
  }
}

module.exports = BaseRouter
