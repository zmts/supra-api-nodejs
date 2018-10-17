const ErrorWrapper = require('../util/ErrorWrapper')
const { checkAccessByTagService } = require('../services/security')

class BaseRouter {
  static actionRunner (action) {
    __typecheck(action, 'Function', true)

    if (!action.hasOwnProperty('accessTag')) {
      throw new ErrorWrapper({ message: `'accessTag' getter not declared in invoked '${action.name}' action`, status: 500 })
    }

    if (!action.hasOwnProperty('run')) {
      throw new ErrorWrapper({ message: `'run' method not declared in invoked '${action.name}' action`, status: 500 })
    }

    return async (req, res, next) => {
      __typecheck(req, 'Object', true)
      __typecheck(res, 'Object', true)
      __typecheck(next, 'Function', true)

      try {
        /**
         * handle json schema response only for create and update actions
         */
        if (req.query.schema && ['POST', 'PATCH', 'GET'].includes(req.method)) {
          return res.json(action.jsonSchema)
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
         * fire action with req, res, next props
         */
        await action.run(req, res, next)
      } catch (error) {
        next(error)
      }
    }
  }
}

module.exports = BaseRouter
