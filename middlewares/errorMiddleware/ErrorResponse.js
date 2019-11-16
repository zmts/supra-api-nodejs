const uuidv4 = require('uuid/v4')

class ErrorResponse {
  constructor (options = {}) {
    this.logId = uuidv4()
    this.success = false
    this.status = options.status || undefined
    this.code = options.code || undefined
    this.message = options.message || undefined
    this.meta = options.meta || undefined
    this.layer = options.layer || undefined
    this.stack = options.stack || undefined
    this.src = options.src || undefined
  }
}

module.exports = ErrorResponse
