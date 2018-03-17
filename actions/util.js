const ErrorWrapper = require('../util/Error')

module.exports.actionRunner = (action = global.required('action')) => {
  return (req, res, next) => {
    if (!action.hasOwnProperty('run')) {
      throw new ErrorWrapper(`'run' method not declared in invoked '${action.name}' action`, 500)
    }
    return action.run(req, res, next)
  }
}
