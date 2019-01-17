const config = require('../config')
const BaseMiddleware = require('../core/BaseMiddleware')

class InitMiddleware extends BaseMiddleware {
  async init () {
    __logger.info('InitMiddleware initialized ...')
  }

  handler () {
    return (req, res, next) => {
      res.header('Server', config.app.name)
      next()
    }
  }
}

module.exports = new InitMiddleware()
