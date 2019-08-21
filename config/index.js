const app = require('./app')
const knex = require('./knex')
const folders = require('./folders')
const token = require('./token')
const roles = require('./roles')
const email = require('./email')
const s3 = require('./s3')

module.exports = {
  app,
  knex,
  folders,
  token,
  roles,
  email,
  s3
}
