const jwt = require('jsonwebtoken')

const { errorCodes, ErrorWrapper } = require('../../core')

/**
 * @return {Promise} token data object
 */
module.exports = token => {
  __typecheck(token, 'String', true)

  let tokenData = jwt.decode(token)

  return new Promise((resolve, reject) => {
    if (!tokenData) return reject(new ErrorWrapper({ ...errorCodes.PARSE_TOKEN }))
    return resolve(tokenData)
  })
}
