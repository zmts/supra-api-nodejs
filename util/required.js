const ErrorWrapper = require('./Error')

module.exports = paramName => {
  throw new ErrorWrapper(`${paramName || 'Required'} parameter not supplied`, 500)
}
