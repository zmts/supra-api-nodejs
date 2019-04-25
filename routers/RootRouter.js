const express = require('express')
const router = express.Router()

const BaseRouter = require('../core/BaseRouter')
const RootProvider = require('../actions/RootProvider')

class RootRouter extends BaseRouter {
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

module.exports = new RootRouter()
