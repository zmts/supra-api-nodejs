const router = require('express').Router()

const actions = require('../actions/posts')
const BaseRouter = require('../core/BaseRouter')
const ErrorWrapper = require('../core/ErrorWrapper')
const { errorCodes } = require('../config')

class PostsRouter extends BaseRouter {
  get router () {
    router.param('id', validatePostId)

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

function validatePostId (req, res, next) {
  if (!Number(req.params.id)) {
    return next(new ErrorWrapper({ ...errorCodes.VALIDATION, message: 'Invalid post id' }))
  }
  next()
}

module.exports = new PostsRouter()
