const { BaseMiddleware } = require('supra-core')

class CorsMiddleware extends BaseMiddleware {
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }

  handler () {
    return (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
      res.header('Access-Control-Expose-Headers', 'X-Total-Count')
      next()
    }
  }
}

module.exports = new CorsMiddleware()
