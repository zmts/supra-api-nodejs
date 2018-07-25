const { cryptoDecryptService, jwtService } = require('../services/auth')
const SECRET = require('../config').token.access.secret
const registry = require('../registry')
const errorCodes = require('../config').errorCodes

module.exports = (req, res, next) => {
  let token = req.headers['token']
  // reset user before each request
  registry.resetCurrentUser()

  if (token) {
    return cryptoDecryptService(token)
      .then(decryptedToken => jwtService.verify(decryptedToken, SECRET))
      .then(tokenData => {
        // set user
        registry.setCurrentUser(tokenData)
        next()
      }).catch(error => {
        registry.resetCurrentUser()

        if (error.code === errorCodes.TOKEN_EXPIRED.code) {
          /**
           * pass request if token is not valid
           * in that case current user data in registry will be empty
           * and security service will be consider that request as guest request
           */
          next()
        } else {
          next(error)
        }
      })
  }
  next()
}

