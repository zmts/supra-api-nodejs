const express = require('express')
const router = express.Router()

const swaggerSpec = require('../swagger')

const BaseController = require('./BaseController')
const AuthController = require('./AuthController')
const PostsController = require('./PostsController')
const UsersController = require('./UsersController')
const checkAccessTokenMiddleware = require('../middlewares/checkAccessTokenMiddleware')

class RootController extends BaseController {
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
    router.use('/auth', AuthController.router)
    router.use('/posts', PostsController.router)
    router.use('/users', UsersController.router)

    return router
  }
}

module.exports = RootController
