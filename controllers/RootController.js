const express = require('express')
const router = express.Router()

const BaseController = require('./BaseController')
const RootProvider = require('../actions/RootProvider')

class RootController extends BaseController {
  get router () {
    router.get('/', (req, res) => {
      res.json({ success: true, message: '(>___<)' })
    })

    return router
  }

  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
    await RootProvider.init()
  }
}

module.exports = new RootController()
