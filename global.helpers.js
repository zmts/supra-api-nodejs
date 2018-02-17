const ErrorWrapper = require('./util/Error')

module.exports = () => {
  global.required = () => {
    throw new ErrorWrapper('Required parameter not supplied', 500)
  }
}
