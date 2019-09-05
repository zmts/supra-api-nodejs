const { jwtHelper } = require('../helpers/auth')
const SECRET = require('../config').token.access.secret
const { errorCodes, BaseMiddleware } = require('supra-core')
const roles = require('../config').roles

class CheckAccessTokenMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      const authorization = req.headers['authorization']
      const bearer = authorization && authorization.startsWith('Bearer ') ? authorization : null
      const token = bearer ? bearer.split('Bearer ')[1] : null

      // set default meta data
      req.currentUser = Object.freeze({
        id: null,
        name: null,
        role: roles.anonymous,
        email: null,
        expiresIn: null
      })

      if (token) {
        return jwtHelper.verify(token, SECRET)
          .then(tokenData => {
            // set actual current user
            req.currentUser = Object.freeze({
              id: Number(tokenData.sub),
              name: tokenData.username,
              role: tokenData.userRole,
              email: tokenData.email,
              expiresIn: Number(tokenData.exp)
            })

            next()
          }).catch(error => {
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
  }
}

module.exports = new CheckAccessTokenMiddleware()
