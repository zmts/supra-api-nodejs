const ErrorWrapper = require('../util/ErrorWrapper')

class BaseController {
  /**
   * pass req, res, next props to run method and fire it
   */
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
        if (req.query.schema && ['POST', 'PATCH'].includes(req.method)) {
          return res.json(action.jsonSchema)
        }
        await action.init(req, action.baseValidationRules, action.accessTag)
        await action.run(req, res, next)
      } catch (error) { next(error) }
    }
  }
}

module.exports = BaseController
