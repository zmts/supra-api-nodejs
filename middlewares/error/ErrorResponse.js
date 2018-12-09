const uuidv4 = require('uuid/v4')

class ErrorResponse {
  constructor (options = {}) {
    this.logId = uuidv4()
    this.success = false
    this.status = options.status || undefined
    this.code = options.code || undefined
    this.valid = options.valid || undefined
    this.key = options.key || undefined
    this.message = options.message || undefined
    this.stack = options.stack || undefined
    this.env = options.env || undefined
  }
}

module.exports = ErrorResponse
