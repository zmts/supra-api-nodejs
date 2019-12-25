const express = require('express')
const router = express.Router()

const { BaseController } = require('./BaseController')
const RootProvider = require('../actions/RootProvider')
const logger = require('../logger')

class RootController extends BaseController {
  get router () {
    router.get('/', (req, res) => {
      res.json({ success: true, message: '(>___<)' })
    })

    return router
  }

  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
    await RootProvider.init()
  }
}

module.exports = new RootController()
