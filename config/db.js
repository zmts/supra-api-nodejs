var objection = require('objection')
var Model = objection.Model

var config = require('./index')

var knexInit = require('knex')({
    client: 'pg',
    connection: {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.db_name,
        charset: config.db.charset
    },
    pool: {
        min: 1,
        max: 10
    }
    // debug: true
})

// connect objection model to knex
Model.knex(knexInit)

module.exports = Model
