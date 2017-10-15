'use strict'
const express = require('express')
const router = express.Router()

const BaseController = require('./baseCtrl')

class PostController extends BaseController {
    static get name () {
        return 'post'
    }

    static get permissions () {
        return {
            admin: [
                ...this.baseActions,
                `${this.name}:add-tag`
            ],
            editor: [
                ...this.baseActions,
                `${this.name}:add-tag`
            ]
        }
    }

    static get router () {
        router.get('/', this.index())
        router.get('/lol', this.lol())
        
        return router
    }

    static index () {
        return (req, res, next) => {
            res.json({ data: 'hello post' })
        }
    }
    
    static lol () {
        return (req, res, next) => {
            res.json({ data: 'post lol' })
        }
    }
}

module.exports = PostController.router