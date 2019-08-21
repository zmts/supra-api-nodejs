const router = require('express').Router()

const actions = require('../actions/users')
const BaseController = require('./BaseController')

class UsersController extends BaseController {
  get router () {
    router.param('id', prepareUserId)

    router.get('/users', this.actionRunner(actions.ListAction))
    router.get('/users/current', this.actionRunner(actions.GetCurrentUserAction))
    router.get('/users/:id', this.actionRunner(actions.GetByIdAction))
    router.post('/users', this.actionRunner(actions.CreateAction))
    router.patch('/users', this.actionRunner(actions.UpdateAction))
    router.delete('/users/:id', this.actionRunner(actions.RemoveAction))

    router.post('/users/change-password', this.actionRunner(actions.ChangePasswordAction))
    router.post('/users/send-reset-email', this.actionRunner(actions.SendResetEmailAction))
    router.post('/users/reset-password', this.actionRunner(actions.ResetPasswordAction))

    router.post('/users/confirm-email', this.actionRunner(actions.ConfirmEmailAction))
    router.post('/users/send-email-confirm-token', this.actionRunner(actions.SendEmailConfirmTokenAction))
    router.post('/users/change-email', this.actionRunner(actions.ChangeEmailAction))

    return router
  }

  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }
}

function prepareUserId (req, res, next) {
  const id = Number(req.params.id)
  if (id) req.params.id = id
  next()
}

module.exports = new UsersController()

