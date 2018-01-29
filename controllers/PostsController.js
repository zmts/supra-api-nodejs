const express = require('express')
const router = express.Router()

const BaseController = require('./BaseController')

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
    router.get('/', index())
    router.get('/lol', lol())

    return router
  }
}

function index () {
  return (req, res, next) => {
    res.json({ data: 'hello post!!!' })
  }
}

function lol () {
  return (req, res, next) => {
    res.json({ data: 'post lol' })
  }
}

module.exports = PostController.router
