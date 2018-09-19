const { jwtService } = require('../services/auth')
const SECRET = require('../config').token.access.secret
const registry = require('../registry')
const errorCodes = require('../config').errorCodes
const roles = require('../config').roles

module.exports = (req, res, next) => {
  const token = req.headers['token']
  // reset user before each request
  registry.currentUser.reset() // TODO refact remove
  // set default meta data
  req._META = {
    currentUser: {
      id: null,
      name: null,
      role: roles.anonymous,
      email: null,
      expiresIn: null
    }
  }

  if (token) {
    return jwtService.verify(token, SECRET)
      .then(tokenData => {
        registry.currentUser.user = tokenData // TODO refact remove
        // set actual current user
        req._META.currentUser = {
          id: +tokenData.sub,
          name: tokenData.username,
          role: tokenData.userRole,
          email: tokenData.email,
          expiresIn: tokenData.exp
        }

        next()
      }).catch(error => {
        registry.currentUser.reset() // TODO refact remove

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

