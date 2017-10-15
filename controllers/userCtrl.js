'use strict'
const express = require('express')
const router = express.Router()

const BaseController = require('./baseCtrl')

class UserController extends BaseController {
    static get name () {
        return 'user'
    }

    static get router () {
        router.get('/', this.index())
        
        return router
    }

    static index () {
        return (req, res, next) => {
            res.json({ data: 'hello user' })
        }
    }

}

module.exports = UserController.router