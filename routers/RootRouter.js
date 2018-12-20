const express = require('express')
const router = express.Router()

const BaseRouter = require('./BaseRouter')
const AuthRouter = require('./AuthRouter')
const PostsRouter = require('./PostsRouter')
const UsersRouter = require('./UsersRouter')

const initMiddleware = require('../middlewares/initMiddleware')
const checkAccessTokenMiddleware = require('../middlewares/checkAccessTokenMiddleware')
const queryMiddleware = require('../middlewares/queryMiddleware')

class RootRouter extends BaseRouter {
  static get router () {
    router.use(initMiddleware)
    router.use(checkAccessTokenMiddleware)
    router.use(queryMiddleware)

    // root route
    router.get('/', (req, res) => {
      res.json({ success: true, message: '(>___<)' })
    })

    // main routes
    router.use('/auth', AuthRouter.router)
    router.use('/posts', PostsRouter.router)
    router.use('/users', UsersRouter.router)

    return router
  }
}

module.exports = RootRouter
