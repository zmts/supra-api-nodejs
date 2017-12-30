'use strict'

const express = require('express')
const router = express.Router()

const authCtrl = require('./authCtrl')
const postsCtrl = require('./postsCtrl')
const usersCtrl = require('./usersCtrl')

router.get('/', function (req, res) {
  res.json({ success: true, data: 'hello root' })
})

router.use('/auth', authCtrl)
router.use('/posts', postsCtrl)
router.use('/users', usersCtrl)

module.exports = router
