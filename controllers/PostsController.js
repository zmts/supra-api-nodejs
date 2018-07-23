const express = require('express')
const router = express.Router()

const actionRunner = require('../actions/actionRunner')
const actions = require('../actions/posts')
const BaseController = require('./BaseController')

class PostsController extends BaseController {
  static get router () {
    router.get('/', actionRunner(actions.ListAction))
    router.get('/:id', actionRunner(actions.GetByIdAction))
    router.post('/', actionRunner(actions.CreateAction))
    router.patch('/:id', actionRunner(actions.UpdateAction))
    router.delete('/:id', actionRunner(actions.RemoveAction))

    return router
  }
}

module.exports = PostsController
