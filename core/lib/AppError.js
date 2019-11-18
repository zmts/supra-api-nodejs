class AppError extends Error {
  constructor (options) {
    if (!options || !options.message) throw new Error('message param required')

    super()
    this.message = options.message
    this.status = options.status || 500
    this.code = options.code || 'UNEXPECTED_ERROR'
    this.layer = options.layer || undefined
    this.meta = options.meta || undefined
    this.req = options.req || undefined
  }
}

module.exports = { AppError }
