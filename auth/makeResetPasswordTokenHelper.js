const jwtHelper = require('./jwtHelper')
const { assert } = require('supra-core')

const SECRET = require('../config').token.resetPassword.secret
const expiresIn = require('../config').token.resetPassword.expiresIn
const type = require('../config').token.resetPassword.type
const iss = require('../config').token.jwtIss
const UserModel = require('../models/UserModel')

/**
 * @return {Promise} string
 */
module.exports = userEntity => {
  assert.object(userEntity, { required: true })
  assert.validate(userEntity.id, UserModel.schema.id, { required: true })
  assert.validate(userEntity.email, UserModel.schema.email, { required: true })

  let config = {
    payload: {
      tokenType: type,
      email: userEntity.email,
      iss
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id,
      expiresIn
    }
  }

  return jwtHelper.sign(config.payload, SECRET, config.options)
}
