const config = require('./config')

module.exports = {
  development: {
    ...config.knex
  }
}
