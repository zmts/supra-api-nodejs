const ErrorWrapper = require('./util/Error')

module.exports = () => {
  throw new ErrorWrapper('Required parameter not supplied', 500)
}
