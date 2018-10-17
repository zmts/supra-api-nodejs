const router = require('express').Router()

const actions = require('../actions/users')
const BaseRouter = require('./BaseRouter')

class UsersRouter extends BaseRouter {
  static get router () {
    router.get('/', this.actionRunner(actions.ListAction))
    router.get('/current', this.actionRunner(actions.GetCurrentUserAction))
    router.get('/:id', this.actionRunner(actions.GetByIdAction))
    router.post('/', this.actionRunner(actions.CreateAction))
    router.patch('/', this.actionRunner(actions.UpdateAction))
    router.delete('/:id', this.actionRunner(actions.RemoveAction))

    router.post('/change-password', this.actionRunner(actions.ChangePasswordAction))
    router.post('/send-reset-email', this.actionRunner(actions.SendResetEmailAction))
    router.post('/reset-password', this.actionRunner(actions.ResetPasswordAction))

    router.post('/confirm-email', this.actionRunner(actions.ConfirmEmailAction))
    router.post('/send-email-confirm-token', this.actionRunner(actions.SendEmailConfirmTokenAction))
    router.post('/change-email', this.actionRunner(actions.ChangeEmailAction))

    return router
  }
}

module.exports = UsersRouter

