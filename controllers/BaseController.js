const ErrorWrapper = require('../util/ErrorWrapper')

class BaseController {
  /**
   * pass req, res, next props to run method and fire it
   */
  static actionRunner (action) {
    __typecheck(action, 'Function', true)

    return (req, res, next) => {
      __typecheck(req, 'Object', true)
      __typecheck(res, 'Object', true)
      __typecheck(next, 'Function', true)

      if (!action.hasOwnProperty('run')) {
        throw new ErrorWrapper({ message: `'run' method not declared in invoked '${action.name}' action`, status: 500 })
      }
      if (req.query.schema) {
        return res.json(action.jsonSchema)
      }
      return action.run(req, res, next)
    }
  }
}

module.exports = BaseController
