const isEmail = require('validator/lib/isEmail')
const { BaseModel, Rule } = require('../core')

const schema = {
  id: new Rule({
    validator: v => (typeof v === 'number') && Number.isInteger(v) && v >= 1,
    description: 'number; integer; min 1;'
  }),
  name: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 50,
    description: 'string; min 3; max 50 chars;'
  }),
  username: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 3 && v.length <= 25,
    description: 'string; min 3; max 25 chars;'
  }),
  email: new Rule({
    validator: v => isEmail(v) && v.length <= 50,
    description: 'string; email; max 50 chars;'
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
