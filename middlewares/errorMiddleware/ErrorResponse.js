const { v4: uuidv4 } = require('uuid')

class ErrorResponse {
  constructor (options = {}) {
    this.logId = uuidv4()
    this.success = false
    this.status = options.status || undefined
    this.code = options.code || undefined
    this.message = options.message || undefined
    this.description = options.description || undefined
    this.meta = options.meta || undefined
    this.layer = options.layer || undefined
    this.stack = options.stack || undefined
    this.src = options.src || undefined
    this.origin = options.origin || undefined
  }
}

module.exports = ErrorResponse
