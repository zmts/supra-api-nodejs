const ErrorWrapper = require('../util/Error')

module.exports = paramName => {
  throw new ErrorWrapper(`${paramName || 'Required'} parameter not supplied`, 500)
}
