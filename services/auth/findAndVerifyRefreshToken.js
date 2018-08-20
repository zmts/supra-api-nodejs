const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')
const jwtService = require('../../services/auth/jwtService')
const SECRET = require('../../config/token').refresh.secret

/**
 * 1 - find refresh token from request in user entity refreshTokensMap
 * 2 - compare refresh token from request and refresh token from DB
 * 3 - verify refresh token
 */
module.exports = (user, reqRefreshToken) => {
  __typecheck(user, 'Object', true)
  __typecheck(user.refreshTokensMap, 'Object', true)
  __typecheck(reqRefreshToken, 'String', true)

  return new Promise((resolve, reject) => {
    const tokenTimestamp = reqRefreshToken.split('::')[0]
    const refreshToken = reqRefreshToken.split('::')[1]
    const existingUserTokenFromDb = user.refreshTokensMap[tokenTimestamp]

    if (!existingUserTokenFromDb) return reject(new ErrorWrapper({ ...errorCodes.NOT_FOUND }))
    if (existingUserTokenFromDb !== reqRefreshToken) return reject(new ErrorWrapper({ ...errorCodes.BAD_REFRESH_TOKEN }))
    return jwtService.verify(refreshToken, SECRET)
      .then(() => resolve())
      .catch(error => {
        return reject(new ErrorWrapper({ ...errorCodes.TOKEN_VERIFY, message: error.message }))
      })
  })
}
