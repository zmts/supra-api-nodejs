const express = require('express')
const router = express.Router()

const swaggerSpec = require('../swagger')

const BaseRouter = require('./BaseRouter')
const AuthRouter = require('./AuthRouter')
const PostsRouter = require('./PostsRouter')
const UsersRouter = require('./UsersRouter')
const checkAccessTokenMiddleware = require('../middlewares/checkAccessTokenMiddleware')

class RootRouter extends BaseRouter {
  static get router () {
    // default auth middleware
    router.use(checkAccessTokenMiddleware)

    // root route
    router.get('/', (req, res) => {
      res.json({ success: true, message: '(>___<)' })
    })

    // api doc route
    router.get('/swagger.json', (req, res) => res.json(swaggerSpec))

    // main routes
    router.use('/auth', AuthRouter.router)
    router.use('/posts', PostsRouter.router)
    router.use('/users', UsersRouter.router)

    return router
  }
}

module.exports = RootRouter
