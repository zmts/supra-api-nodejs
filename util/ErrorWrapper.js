class ErrorWrapper extends Error {
  constructor (options) {
    if (!options || !options.message) throw new Error('message param required')

    super()
    this.message = options.message
    this.status = options.status || 500
    this.code = options.code || 'SERVER_ERROR'
  }
}

module.exports = ErrorWrapper
