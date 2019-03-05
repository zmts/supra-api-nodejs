class ErrorWrapper extends Error {
  constructor (options) {
    if (!options || !options.message) throw new Error('message param required')

    super()
    this.message = options.message
    this.status = options.status || 500
    this.code = options.code || 'SERVER_ERROR'
    this.meta = options.meta || undefined
    this.req = options.req ? {
      user: options.req.currentUser,
      ip: options.req.ip,
      headers: options.req.headers,
      url: options.req.url,
      method: options.req.method
    } : undefined
  }
}

module.exports = ErrorWrapper
