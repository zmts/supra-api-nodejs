const app = require('./app')
const knex = require('./knex')
const folders = require('./folders')
const token = require('./token')
const email = require('./email')
const s3 = require('./s3')

const asyncConfigs = [
  app,
  knex,
  token,
  email,
  s3
]

function rootInit () {
  return new Promise(async (resolve, reject) => {
    for (const config of asyncConfigs) {
      try {
        await config.init()
      } catch (e) {
        return reject(e)
      }
    }
    resolve()
  })
}

module.exports = {
  app,
  knex,
  folders,
  token,
  email,
  s3,
  rootInit
}
