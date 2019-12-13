const app = require('./app')
const knex = require('./knex')
const folders = require('./folders')
const token = require('./token')
const email = require('./email')
const s3 = require('./s3')

module.exports = {
  app,
  knex,
  folders,
  token,
  email,
  s3
}
