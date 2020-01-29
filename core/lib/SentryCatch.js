const Sentry = require('@sentry/node')

class SentryCatch {
  constructor (dsn) {
    if (typeof dsn !== 'string' || !dsn.startsWith('http')) {
      throw new Error(`${this.constructor.name}: invalid DSN.`)
    }

    try {
      Sentry.init({ dsn })
    } catch (e) {
      throw new Error(`${this.constructor.name}: fails to construct.`)
    }
  }

  captureException (error, meta = {}) {
    Sentry.withScope(scope => {
      scope.setExtras({ ...meta })
      Sentry.captureException(error)
    })
  }

  captureMessage (message, meta = {}) {
    Sentry.withScope(scope => {
      scope.setExtras({ ...meta })
      Sentry.captureMessage(message, Sentry.Severity.Info)
    })
  }
}

module.exports = { SentryCatch }
