const { Assert: assert } = require('./assert')
const { AbstractLogger } = require('./AbstractLogger')

class BaseMiddleware {
  constructor ({ logger } = {}) {
    assert.instanceOf(logger, AbstractLogger)

    this.logger = logger
  }

  async init () {
    throw new Error(`${this.constructor.name} should implement 'init' method.`)
  }

  handler () {
    throw new Error(`${this.constructor.name} should implement 'handler' method.`)
  }
}

module.exports = { BaseMiddleware }
