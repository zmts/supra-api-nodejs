const express = require('express')
const router = express.Router()

const BaseRouter = require('../core/BaseRouter')

class RootRouter extends BaseRouter {
  get router () {
    router.get('/', (req, res) => {
      res.json({ success: true, message: '(>___<)' })
    })

    return router
  }

  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }
}

module.exports = new RootRouter()
