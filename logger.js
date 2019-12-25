const { Logger } = require('supra-core')

module.exports = new Logger({
  appName: 'SupraAPI'
  // raw: true
  // capture: true,
  // sentryDns: config.app.sentryDns
})
