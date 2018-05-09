const express = require('express')
const router = express.Router()

const AuthController = require('./AuthController')
const PostsController = require('./PostsController')
const UsersController = require('./UsersController')
const checkAccessTokenMiddleware = require('../middlewares/checkAccessTokenMiddleware')

// default auth middleware
router.use(checkAccessTokenMiddleware)

router.get('/', (req, res) => {
  res.json({ success: true, message: '(>___<)' })
})

router.use('/auth', AuthController.router)
router.use('/posts', PostsController.router)
router.use('/users', UsersController.router)

module.exports = router
