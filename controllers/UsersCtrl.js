const express = require('express')
const router = express.Router()

const actionRunner = require('../actions/util').actionRunner
const actions = require('../actions/users')
const BaseController = require('./BaseCtrl')

class UsersController extends BaseController {
  static get router () {
    router.get('/', actionRunner(actions.List))
    router.get('/:id', actionRunner(actions.GetById))
    router.post('/', actionRunner(actions.Create))

    return router
  }
}

module.exports = UsersController.router
