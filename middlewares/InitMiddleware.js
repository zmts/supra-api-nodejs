const { BaseMiddleware } = require('supra-core')
const config = require('../config')
const logger = require('../logger')
const { build } = require('../build.json')

class InitMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      res.header('X-Server', config.app.name)
      res.header('X-Server-Build', build)
      next()
    }
  }
}

module.exports = { InitMiddleware }
