const express = require('express')
const router = express.Router()

const actionRunner = require('../actions/actionRunner')
const actions = require('../actions/users')
const BaseController = require('./BaseController')

class UsersController extends BaseController {
  static get router () {
    router.get('/', actionRunner(actions.ListAction))
    router.get('/:id', actionRunner(actions.GetByIdAction))
    router.post('/', actionRunner(actions.CreateAction))
    router.patch('/', actionRunner(actions.UpdateAction))
    router.post('/change-password', actionRunner(actions.ChangePasswordAction))
    router.post('/send-reset-email', actionRunner(actions.SendResetEmailAction))
    router.post('/reset-password', actionRunner(actions.ResetPasswordAction))

    return router
  }
}

module.exports = UsersController
