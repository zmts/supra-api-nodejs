const path = require('path')
require('dotenv').load({ path: path.join(__dirname, '../.env') })

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: process.env.DB_CHARSET
  },
  pool: {
    min: 1,
    max: 10
  }
  // debug: true
}
