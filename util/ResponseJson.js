class ResponseJson {
  constructor (options) {
    __typecheck(options, 'Object', true)

    this.success = options.success || true
    this.data = options.data || undefined
    this.message = options.message || undefined
  }
}

module.exports = ResponseJson
