const uuidv4 = require('uuid/v4')

class ErrorResponse {
  constructor (options = {}) {
    this.uuid = uuidv4()
    this.success = false
    this.message = options.message || undefined
    this.code = options.code || undefined
    this.stack = options.stack || undefined
    this.env = options.env || undefined
    this.valid = options.valid || undefined
    this.key = options.key || undefined
  }
}

exports.module = ErrorResponse
