const router = require('express').Router()

const actions = require('../actions/users')
const BaseController = require('./BaseController')

class UsersController extends BaseController {
  get router () {
    router.get('/users', this.actionRunner(actions.ListUsersAction))
    router.get('/users/current', this.actionRunner(actions.GetCurrentUserAction))
    router.get('/users/:id', this.actionRunner(actions.GetUserByIdAction))
    router.post('/users', this.actionRunner(actions.CreateUserAction))
    router.patch('/users', this.actionRunner(actions.UpdateUserAction))
    router.delete('/users/:id', this.actionRunner(actions.RemoveUserAction))

    router.post('/users/change-password', this.actionRunner(actions.ChangePasswordAction))
    router.post('/users/send-reset-password-email', this.actionRunner(actions.SendResetPasswordEmailAction))
    router.post('/users/reset-password', this.actionRunner(actions.ResetPasswordAction))

    router.post('/users/confirm-registration', this.actionRunner(actions.ConfirmRegistrationAction))
    router.post('/users/change-email', this.actionRunner(actions.ChangeEmailAction))
    router.post('/users/confirm-email', this.actionRunner(actions.ConfirmEmailAction))
    router.post('/users/send-email-confirm-token', this.actionRunner(actions.SendEmailConfirmTokenAction))
    router.post('/users/cancel-email-changing', this.actionRunner(actions.CancelEmailChangingAction))

    return router
  }

  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }
}

module.exports = new UsersController()

