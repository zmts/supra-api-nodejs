const express = require('express')
const router = express.Router()

const { initialMetaData } = require('../middleware/initialMetaData')

const AuthCtrl = require('./AuthCtrl')
const PostsCtrl = require('./PostsCtrl')
const UsersCtrl = require('./UsersCtrl')

// initial meta object
router.use(initialMetaData())

// auth middleware
router.use(function (req, res, next) {
  // check token
  next()
})

router.get('/', (req, res) => {
  res.json({ success: true, message: '(>___<)' })
})

router.use('/auth', AuthCtrl)
router.use('/posts', PostsCtrl)
router.use('/users', UsersCtrl)

module.exports = router
