const router = require('express').Router()

const actions = require('../actions/posts')
const BaseController = require('./BaseController')

class PostsController extends BaseController {
  get router () {
    router.param('id', preparePostId)

    router.get('/posts', this.actionRunner(actions.ListAction))
    router.get('/posts/:id', this.actionRunner(actions.GetByIdAction))
    router.post('/posts', this.actionRunner(actions.CreateAction))
    router.patch('/posts/:id', this.actionRunner(actions.UpdateAction))
    router.delete('/posts/:id', this.actionRunner(actions.RemoveAction))

    return router
  }

  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }
}

function preparePostId (req, res, next) {
  const id = Number(req.params.id)
  if (id) req.params.id = id
  next()
}

module.exports = new PostsController()
