const isEmail = require('validator/lib/isEmail')
const isJWT = require('validator/lib/isJWT')
const isUUID = require('validator/lib/isUUID')
const { BaseModel, Rule } = require('supra-core')

const { roles } = require('../config')
const rolesList = Object.values(roles)

const schema = {
  ...BaseModel.genericSchema,

  id: new Rule({
    validator: v => isUUID(v),
    description: 'UUID;'
  }),
  name: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 50,
    description: 'string; min 3; max 50 chars;'
  }),
  username: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 25,
    description: 'string; min 3; max 25 chars;'
  }),
  role: new Rule({
    validator: v => (typeof v === 'string') && rolesList.includes(v),
    description: `enum; one of: ${rolesList}`
  }),
  email: new Rule({
    validator: v => isEmail(v) && v.length <= 50,
    description: 'string; email; max 50 chars;'
  }),
  newEmail: new Rule({
    validator: v => isEmail(v) && v.length <= 50,
    description: 'string; email; max 50 chars;'
  }),
  emailConfirmToken: new Rule({
    validator: v => isJWT(v),
    description: 'string; jwt;'
  }),
  resetPasswordToken: new Rule({
    validator: v => isJWT(v),
    description: 'string; jwt;'
  }),
  passwordHash: new Rule({
    validator: v => typeof v === 'string' && v.length >= 8,
    description: 'string; min 8 chars;'
  }),
  location: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 300,
    description: 'string; min 3; max 300 chars;'
  })
}

class UserModel extends BaseModel {
  static get schema () {
    return schema
  }
}

module.exports = UserModel
