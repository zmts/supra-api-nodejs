const joi = require('@hapi/joi')
const JoiToJsonSchema = require('joi-to-json-schema')
const { checkAccessByTagService } = require('../services/security')
const ErrorWrapper = require('../core/ErrorWrapper')
const { errorCodes } = require('../config')

class BaseController {
  async init () {
    throw new Error(`${this.constructor.name} should implement 'init' method.`)
  }

  get router () {
    throw new Error(`${this.constructor.name} should implement 'router' getter.`)
  }

  async validate2 (ctx, rules) {
    __typecheck(ctx, __type.object, true)
    __typecheck(rules, __type.object, true)

    // map list of validation schemas
    let validationSchemas = Object.keys(rules).map(key => {
      return joi.validate(ctx[key], rules[key])
    })

    // execute validation
    await Promise.all(validationSchemas)
  }

  async validateModel (body, rules) {
    __typecheck(body, __type.object, true)
    __typecheck(rules, __type.object, true)

    Object.keys(rules).forEach(ruleKey => {
      const validationTarget = body[ruleKey]
      const [rule, required] = rules[ruleKey]
      const validator = rule.validator
      const description = rule.description || ''
      const type = rule.type.name

      if (required && !body.hasOwnProperty(ruleKey)) {
        throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `'${ruleKey}' field is required.` })
      }

      if (body.hasOwnProperty(ruleKey)) {
        joi.validate(validationTarget, validator, error => {
          if (error) {
            error.message = `invalid '${ruleKey}' field. Type: ${type}. Description: ${description}`
            throw error
          }
        })
      }
    })
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
        if (action.validationRules && action.validationRules.body) {
          await this.validateModel(ctx.body, action.validationRules.body)
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
