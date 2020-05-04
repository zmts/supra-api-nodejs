const router = require('express').Router()

const actions = require('./actions')
const { BaseController } = require('../../rootcommmon/BaseController')

class PostsController extends BaseController {
  get router () {
    router.param('id', preparePostId)

    router.get('/posts', this.actionRunner(actions.ListPostsAction))
    router.get('/posts/:id', this.actionRunner(actions.GetPostByIdAction))
    router.post('/posts', this.actionRunner(actions.CreatePostAction))
    router.patch('/posts/:id', this.actionRunner(actions.UpdatePostAction))
    router.delete('/posts/:id', this.actionRunner(actions.RemovePostAction))

    return router
  }

  async init () {
    this.logger.debug(`${this.constructor.name} initialized...`)
  }
}

function preparePostId (req, res, next) {
  const id = Number(req.params.id)
  if (id) req.params.id = id
  next()
}

module.exports = { PostsController }
