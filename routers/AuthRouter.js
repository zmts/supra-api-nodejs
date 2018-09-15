const router = require('express').Router()

const BaseRouter = require('./BaseRouter')
const actions = require('../actions/auth')

class AuthRouter extends BaseRouter {
  static get router () {
    router.post('/login', this.actionRunner(actions.LoginAction))
    router.post('/logout', this.actionRunner(actions.LogoutAction))
    router.post('/refresh-tokens', this.actionRunner(actions.RefreshTokensAction))

    return router
  }
}

module.exports = AuthRouter
