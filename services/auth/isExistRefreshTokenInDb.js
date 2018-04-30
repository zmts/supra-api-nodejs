const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

/**
 * check refresh token in refreshTokensMap
 */
module.exports = (user, refreshToken) => {
  __typecheck(user, 'Object', true)
  __typecheck(user.refreshTokensMap, 'Object', true)
  __typecheck(refreshToken, 'String', true)

  return new Promise((resolve, reject) => {
    let tokenTimestamp = ''
    try {
      tokenTimestamp = refreshToken.split('.')[0]
    } catch (error) {
      return reject(new Error(error))
    }

    if (!user.refreshTokensMap[tokenTimestamp]) return reject(new ErrorWrapper({ ...errorCodes.NOT_FOUND }))
    return resolve()
  })
}
