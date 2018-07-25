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
    router.delete('/:id', actionRunner(actions.RemoveAction))
    router.get('/:id/posts', actionRunner(actions.GetPostsByUserIdAction))

    router.post('/change-password', actionRunner(actions.ChangePasswordAction))
    router.post('/send-reset-email', actionRunner(actions.SendResetEmailAction))
    router.post('/reset-password', actionRunner(actions.ResetPasswordAction))

    router.post('/confirm-email', actionRunner(actions.ConfirmEmailAction))
    router.post('/send-email-confirm-token', actionRunner(actions.SendEmailConfirmTokenAction))
    router.post('/change-email', actionRunner(actions.ChangeEmailAction))

    return router
  }
}

module.exports = UsersController
