const express = require('express')
const router = express.Router()

const { BaseController } = require('../../rootcommmon/BaseController')
const RootProvider = require('../RootProvider')

class RootController extends BaseController {
  get router () {
    router.get('/', (req, res) => {
      res.json({ success: true, message: '(>___<)' })
    })

    return router
  }

  async init () {
    this.logger.debug(`${this.constructor.name} initialized...`)
    await RootProvider.init()
  }
}

module.exports = { RootController }
