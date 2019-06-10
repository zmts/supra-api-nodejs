const joi = require('@hapi/joi')
const JoiToJsonSchema = require('joi-to-json-schema')
const { checkAccessByTagService } = require('../services/security')

class BaseController {
  async init () {
    throw new Error(`${this.constructor.name} should implement 'init' method.`)
  }

  get router () {
    throw new Error(`${this.constructor.name} should implement 'router' getter.`)
  }

  async validate (ctx, rules) {
    __typecheck(ctx, __type.object, true)
    __typecheck(rules, __type.object, true)

    // map list of validation schemas
    let validationSchemas = Object.keys(rules).map(key => {
      return joi.validate(ctx[key], rules[key])
    })

    // execute validation
    await Promise.all(validationSchemas)
  }

  actionRunner (action) {
    __typecheck(action, __type.function, true)

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

      const ctx = {
        currentUser: req.currentUser,
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip,
        method: req.method,
        url: req.url,
        headers: {
          'Content-Type': req.get('Content-Type'),
          Referer: req.get('referer'),
          'User-Agent': req.get('User-Agent')
        }
      }

      try {
        /**
         * it will return request schema
         */
        if (action.validationRules && ctx.query.schema && ['POST', 'PATCH', 'GET'].includes(ctx.method)) {
          return res.json(JoiToJsonSchema(joi.object().keys(action.validationRules)))
        }

        /**
         * check access to action by access tag
         */
        await checkAccessByTagService(action.accessTag, ctx.currentUser)

        /**
         * validate action input data
         */
        if (action.validationRules) {
          await this.validate(ctx, action.validationRules)
        }

        /**
         * fire action
         */
        const response = await action.run(ctx)

        /**
         * set headers
         */
        if (response.headers) res.set(response.headers)

        /**
         * set status and return result to client
         */
        return res.status(response.status).json({
          success: response.success,
          message: response.message,
          data: response.data
        })
      } catch (error) {
        error.req = ctx
        next(error)
      }
    }
  }
}

module.exports = BaseController
