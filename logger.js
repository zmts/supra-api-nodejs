const config = require('./config')
const { Logger } = require('supra-core')

module.exports = new Logger({
  appName: config.app.name
})
