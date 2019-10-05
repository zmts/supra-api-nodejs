const isUUID = require('validator/lib/isUUID')
const isIP = require('validator/lib/isIP')
const { BaseModel, Rule } = require('supra-core')

const UserModel = require('./UserModel')

const schema = {
  userId: UserModel.schema.id,
  refreshToken: new Rule({
    validator: v => isUUID(v),
    description: 'UUID;'
  }),
  os: new Rule({
    validator: v => typeof v === 'string' && v.length <= 200,
    description: 'string; max 200 chars;'
  }),
  ua: new Rule({
    validator: v => typeof v === 'string' && v.length <= 200,
    description: 'string; max 200 chars;'
  }),
  browser: new Rule({
    validator: v => typeof v === 'string' && v.length <= 500,
    description: 'string; max 500 chars;'
  }),
  fingerprint: new Rule({
    validator: v => typeof v === 'string' && v.length <= 200,
    description: 'string; max 200 chars;'
  }),
  ip: new Rule({
    validator: v => isIP(v),
    description: 'string; IP;'
  }),
  expiredAt: new Rule({
    validator: v => Number.isInteger(v),
    description: 'number;'
  })
}

class SessionModel extends BaseModel {
  static get schema () {
    return schema
  }
}

module.exports = SessionModel
