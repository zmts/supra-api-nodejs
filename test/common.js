const { host, port } = require('../config').app

const appUrl = `${host}:${port}`
const testEmail = process.env.TEST_EMAIL
const testPassword = process.env.TEST_PASSWORD
const fingerprint = '12345678901234567890'

module.exports = {
  appUrl,
  testEmail,
  testPassword,
  fingerprint
}
