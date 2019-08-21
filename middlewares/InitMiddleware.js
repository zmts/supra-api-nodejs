const config = require('../config')
const { BaseMiddleware } = require('../core')

class InitMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      res.header('Server', config.app.name)
      next()
    }
  }
}

module.exports = new InitMiddleware()
