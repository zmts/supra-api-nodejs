const { Logger } = require('supra-core')
const sentryDsn = process.env.SENTRY_DSN
const isDev = process.env.NODE_ENV === 'development'

module.exports = new Logger({
  appName: 'supra-api',
  raw: !isDev,
  ...(!isDev && { capture: true, sentryDsn })
})
