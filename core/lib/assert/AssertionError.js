class AssertionError extends Error {
  constructor (message) {
    super(message)
    this.message = message || 'Assertion error'
    this.code = 'ASSERTION_ERROR'
    this.status = 500
  }
}

module.exports = { AssertionError }
