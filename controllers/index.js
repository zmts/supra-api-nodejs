'use strict'

const express = require('express')
const router = express.Router()

const authCtrl = require('./authCtrl')
const postCtrl = require('./postCtrl')
const userCtrl = require('./userCtrl')

router.get('/', function (req, res) {
    res.json({ success: true, data: 'hello root' })
})

router.use('/auth', authCtrl)
router.use('/posts', postCtrl)
router.use('/users', userCtrl)

module.exports = router
