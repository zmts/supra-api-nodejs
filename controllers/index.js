const express = require('express')
const router = express.Router()

const AuthController = require('./AuthController')
const PostsController = require('./PostsController')
const UsersController = require('./UsersController')

// auth middleware
router.use(function (req, res, next) {
  // check token
  next()
})

router.get('/', (req, res) => {
  res.json({ success: true, message: '(>___<)' })
})

router.use('/auth', AuthController)
router.use('/posts', PostsController)
router.use('/users', UsersController)

module.exports = router
