const express = require('express')
const router = express.Router()

const actionRunner = require('../actions/util').actionRunner
const actions = require('../actions/users')
const BaseController = require('./BaseController')

class UsersController extends BaseController {
  static get router () {
    router.get('/', actionRunner(actions.ListAction))
    router.get('/:id', actionRunner(actions.GetByIdAction))
    router.post('/', actionRunner(actions.CreateAction))

    return router
  }
}

module.exports = UsersController.router
