const { assert } = require('supra-core')

const { jwtSign } = require('../../../rootcommmon/jwt')
const { UserModel } = require('../../../models/UserModel')

const SECRET = require('../../../config').token.access.secret
const expiresIn = require('../../../config').token.access.expiresIn
const type = require('../../../config').token.access.type
const iss = require('../../../config').token.jwtIss

/**
 * @return {Promise} string
 */
function makeAccessToken (userEntity) {
  assert.object(userEntity, { required: true })
  assert.validate(userEntity.id, UserModel.schema.id, { required: true })
  assert.validate(userEntity.name, UserModel.schema.name, { required: true })
  assert.validate(userEntity.role, UserModel.schema.role, { required: true })
  assert.validate(userEntity.email, UserModel.schema.email, { required: true })

  let config = {
    payload: {
      tokenType: type,
      username: userEntity.name,
      userRole: userEntity.role,
      email: userEntity.email,
      iss
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id,
      expiresIn
    }
  }

  return jwtSign(config.payload, SECRET, config.options)
}

module.exports = { makeAccessToken }
