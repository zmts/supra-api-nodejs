const config = require('./config')
const { Logger } = require('supra-core')

const logger = new Logger({
  appName: config.app.name
})

module.exports = logger

