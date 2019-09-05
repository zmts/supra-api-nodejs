const { checkAccessByTagService } = require('../services/security')
const { errorCodes, ErrorWrapper } = require('supra-core')

class BaseController {
  constructor () {
    if (!this.init) throw new Error(`${this.constructor.name} should implement 'init' method.`)
    if (!this.router) throw new Error(`${this.constructor.name} should implement 'router' getter.`)
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
        if (ctx.query.schema && ['POST', 'PATCH', 'GET'].includes(ctx.method) && process.env.NODE_ENV === 'development') {
          return res.json(getSchemaDescription(action.validationRules))
        }

        /**
         * check access to action by access tag
         */
        await checkAccessByTagService(action.accessTag, ctx.currentUser)

        /**
         * verify empty body
         */
        if (action.validationRules && action.validationRules.notEmptyBody && !Object.keys(ctx.body).length) {
          return next(new ErrorWrapper({ ...errorCodes.EMPTY_BODY }))
        }

        /**
         * validate action input data
         */
        if (action.validationRules) {
          if (action.validationRules.query) validateSchema(ctx.query, action.validationRules.query, 'query')
          if (action.validationRules.params) validateSchema(ctx.params, action.validationRules.params, 'params')
          if (action.validationRules.body) validateSchema(ctx.body, action.validationRules.body, 'body')
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

function validateSchema (src, requestSchema, schemaTitle) {
  __typecheck(src, __type.object, true, `Invalid request validation payload. Only object allowed. Actual type: ${Object.prototype.toString.call(src)}`)
  __typecheck(requestSchema, __type.object, true)
  __typecheck(schemaTitle, __type.string, true)

  const schemaKeys = Object.keys(requestSchema)
  const srcKeys = Object.keys(src)

  const invalidExtraKeys = srcKeys.filter(srcKey => !schemaKeys.includes(srcKey))
  if (invalidExtraKeys.length) {
    throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `Extra keys found in '${schemaTitle}' payload: [${invalidExtraKeys}]` })
  }

  schemaKeys.forEach(propName => {
    const validationSrc = src[propName]

    const [schemaRule, isRequiredSchemaField] = requestSchema[propName]
    const { validator, description } = schemaRule

    if (isRequiredSchemaField && !src.hasOwnProperty(propName)) {
      throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `'${schemaTitle}.${propName}' field is required.` })
    }

    if (src.hasOwnProperty(propName)) {
      const validationResult = validator(validationSrc)

      if (!['boolean', 'string'].includes(typeof validationResult)) {
        throw new ErrorWrapper({ ...errorCodes.SERVER, message: `Invalid '${schemaTitle}.${propName}' field validation result. Validator should return boolean or string.` })
      }

      if (typeof validationResult === 'string') {
        throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `Invalid '${schemaTitle}.${propName}' field. Description: ${validationResult}` })
      }

      if (!validationResult) {
        throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `Invalid '${schemaTitle}.${propName}' field. Description: ${description}` })
      }
    }
  })
}

function getSchemaDescription (validationRules = {}) {
  __typecheck(validationRules, __type.object, true)

  function getRuleDescription (propName, schema) {
    __typecheck(propName, __type.string, true)
    __typecheck(schema, __type.object, true)

    const ruleWrapper = schema[propName]
    __typecheck(ruleWrapper, __type.array, false, 'Invalid request rule wrapper type. Acceptable type is Array')

    if (!ruleWrapper) return
    const [ rule, required ] = ruleWrapper

    return `${rule.description} ${required ? '(required)' : '(optional)'}`
  }

  const result = { query: {}, params: {}, body: {} }
  const { query, params, body } = validationRules

  if (query) Object.keys(query).forEach(schemaPropName => (result.query[schemaPropName] = getRuleDescription(schemaPropName, query)))
  if (params) Object.keys(params).forEach(schemaPropName => (result.params[schemaPropName] = getRuleDescription(schemaPropName, params)))
  if (body) Object.keys(body).forEach(schemaPropName => (result.body[schemaPropName] = getRuleDescription(schemaPropName, body)))

  return result
}

module.exports = BaseController
