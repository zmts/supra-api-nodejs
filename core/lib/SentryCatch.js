const Sentry = require('@sentry/node')

class SentryCatch {
  constructor (dns) {
    if (typeof dns !== 'string' || !dns.startsWith('http')) {
      throw new Error(`${this.constructor.name}: invalid DNS.`)
    }

    try {
      Sentry.init({ dsn: dns })
    } catch (e) {
      throw new Error(`${this.constructor.name}: fails to construct.`)
    }
  }

  captureException (error, meta = {}) {
    Sentry.withScope(scope => {
      scope.setUser({ ...meta })
      Sentry.captureException(error)
    })
  }

  captureMessage (message, meta = {}) {
    Sentry.withScope(scope => {
      scope.setUser({ ...meta })
      Sentry.captureMessage(message, 'debug')
    })
  }
}

module.exports = { SentryCatch }
