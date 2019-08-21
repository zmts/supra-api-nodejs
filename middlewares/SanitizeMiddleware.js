const { BaseMiddleware } = require('supra-core')

class SanitizeMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      next()
    }
  }
}

module.exports = new SanitizeMiddleware()
