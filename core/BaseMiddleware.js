class BaseMiddleware {
  static init () {
    throw new Error('Define \'init\' method')
  }

  static handler () {
    throw new Error('Define \'handler\' method')
  }
}

module.exports = BaseMiddleware
