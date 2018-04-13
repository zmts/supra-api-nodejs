const express = require('express')
const router = express.Router()

const BaseController = require('./BaseController')
const actionRunner = require('../actions/util').actionRunner
const actions = require('../actions/auth')

class AuthController extends BaseController {
  static get router () {
    router.post('/login', actionRunner(actions.LoginAction))
    // router.post('/logout', auth.checkToken(), sec.isLoggedIn(), auth.signOut())
    router.post('/refresh-tokens', actionRunner(actions.RefreshTokensAction))
    router.get('/add-refresh-tokens/:id', actionRunner(actions.AddRefreshTokensAction))

    return router
  }
}

module.exports = AuthController
