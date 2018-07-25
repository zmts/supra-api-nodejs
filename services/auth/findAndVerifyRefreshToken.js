const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')
const jwtService = require('../../services/auth/jwtService')
const SECRET = require('../../config/token').refresh.secret

/**
 * 1 - find refresh token from request in user entity refreshTokensMap
 * 2 - compare refresh token from request and refresh token from DB
 * 3 - verify refresh token
 */
module.exports = (user, reqRefreshToken, decodedRefreshToken) => {
  __typecheck(user, 'Object', true)
  __typecheck(user.refreshTokensMap, 'Object', true)
  __typecheck(reqRefreshToken, 'String', true)
  __typecheck(decodedRefreshToken, 'String', true)

  return new Promise((resolve, reject) => {
    let tokenTimestamp = reqRefreshToken.split('.')[0]
    let existingUserTokenFromDb = user.refreshTokensMap[tokenTimestamp]

    if (!existingUserTokenFromDb) return reject(new ErrorWrapper({ ...errorCodes.NOT_FOUND }))
    if (existingUserTokenFromDb !== reqRefreshToken) return reject(new ErrorWrapper({ ...errorCodes.BAD_REFRESH_TOKEN }))
    return jwtService.verify(decodedRefreshToken, SECRET)
      .then(() => resolve())
      .catch(() => {
        return reject(new ErrorWrapper({ ...errorCodes.TOKEN_EXPIRED }))
      })
  })
}
