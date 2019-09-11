const jwt = require('jsonwebtoken')

const { errorCodes, ErrorWrapper, assert } = require('supra-core')

/**
 * @return {Promise} token data object
 */
module.exports = token => {
  assert.string(token, { notEmpty: true })

  let tokenData = jwt.decode(token)

  return new Promise((resolve, reject) => {
    if (!tokenData) return reject(new ErrorWrapper({ ...errorCodes.PARSE_TOKEN }))
    return resolve(tokenData)
  })
}
