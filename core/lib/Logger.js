const assert = require('./assert')

class Logger {
  constructor ({ fatal, error, warn, trace, info } = {}) {
    assert.func(fatal, { required: true })
    assert.func(error, { required: true })
    assert.func(warn, { required: true })
    assert.func(trace, { required: true })
    assert.func(info, { required: true })

    this.fatal = fatal
    this.error = error
    this.warn = warn
    this.trace = trace
    this.info = info
  }
}

module.exports = Logger
