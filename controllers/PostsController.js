const express = require('express')
const router = express.Router()

const actionRunner = require('../actions/util').actionRunner
const actions = require('../actions/posts')
const BaseController = require('./BaseController')

class UsersController extends BaseController {
  static get router () {
    router.get('/', actionRunner(actions.ListAction))

    return router
  }
}

module.exports = UsersController
