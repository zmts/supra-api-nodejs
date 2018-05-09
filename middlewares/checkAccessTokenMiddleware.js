const { cryptoDecryptService, jwtService } = require('../services/auth')
const SECRET = require('../config').token.access
const registry = require('../registry')
const errorCodes = require('../config/errorCodes')

module.exports = (req, res, next) => {
  let token = req.headers['token']

  if (token) {
    return cryptoDecryptService(token)
      .then(decryptedToken => jwtService.verify(decryptedToken, SECRET))
      .then(tokenData => {
        registry.setCurrentUser(tokenData)
        next()
      })
      .catch(error => {
        if (error.code === errorCodes.TOKEN_EXPIRED.code) return next()
        next(error)
      })
  }
  next()
}

