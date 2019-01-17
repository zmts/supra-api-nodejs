class BaseMiddleware {
  async init () {
    throw new Error('Middleware should implement \'init\' method.')
  }

  handler () {
    throw new Error('Middleware should implement \'handler\' method.')
  }
}

module.exports = BaseMiddleware
