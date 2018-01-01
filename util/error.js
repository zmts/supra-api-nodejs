module.exports.ErrorWrapper = class ErrorWrapper extends Error {
  constructor (message, status) {
    super()
    this.stack = new Error().stack
    this.message = message
    this.status = status
  }
}
