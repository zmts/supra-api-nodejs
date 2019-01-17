const router = require('express').Router()

const BaseRouter = require('../core/BaseRouter')
const actions = require('../actions/auth')

class AuthRouter extends BaseRouter {
  get router () {
    router.post('/auth/login', this.actionRunner(actions.LoginAction))
    router.post('/auth/logout', this.actionRunner(actions.LogoutAction))
    router.post('/auth/refresh-tokens', this.actionRunner(actions.RefreshTokensAction))

    return router
  }

  async init () {
    __logger.info('AuthRouter initialized...')
  }
}

module.exports = new AuthRouter()
