const { Abstract } = require('./Abstract')

class AbstractLogger extends Abstract {
  constructor () {
    super()

    if (new.target === AbstractLogger) {
      throw new Error(`${this.constructor.name}: abstract classes can't be created directly`)
    }

    this.__abstractMethod(this, 'fatal', 3)
    this.__abstractMethod(this, 'error', 3)
    this.__abstractMethod(this, 'warn', 3)
    this.__abstractMethod(this, 'info', 2)
    this.__abstractMethod(this, 'debug', 2)
    this.__abstractMethod(this, 'trace', 2)
  }
}

module.exports = { AbstractLogger }
