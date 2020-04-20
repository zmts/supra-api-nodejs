const isUUID = require('validator/lib/isUUID')
const isIP = require('validator/lib/isIP')
const { BaseModel, Rule } = require('supra-core')

const { UserModel } = require('./UserModel')

const schema = {
  userId: UserModel.schema.id,
  refreshToken: new Rule({
    validator: v => isUUID(v),
    description: 'UUID;'
  }),
  ua: new Rule({
    validator: v => typeof v === 'string' && v.length <= 200,
    description: 'string; max 200 chars;'
  }),
  fingerprint: new Rule({
    validator: v => typeof v === 'string' && v.length <= 200,
    description: 'string; max 200 chars;'
  }),
  ip: new Rule({
    validator: v => isIP(v),
    description: 'string; IP;'
  }),
  expiresIn: new Rule({
    validator: v => Boolean(v) && Number.isInteger(Number(v)),
    description: 'number;'
  })
}

class RefreshSessionModel extends BaseModel {
  static get schema () {
    return schema
  }
}

module.exports = { RefreshSessionModel }
