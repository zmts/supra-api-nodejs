const { assert } = require('supra-core')
const { jwtSign } = require('../../../rootcommmon/jwt')

const SECRET = require('../../../config').token.emailConfirm.secret
const expiresIn = require('../../../config').token.emailConfirm.expiresIn
const type = require('../../../config').token.emailConfirm.type
const iss = require('../../../config').token.jwtIss

/**
 * @return {Promise} string
 */
function makeEmailConfirmToken (userEntity) {
  assert.object(userEntity, { required: true })

  let config = {
    payload: {
      tokenType: type,
      email: userEntity.email,
      newEmail: userEntity.newEmail,
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

module.exports = { makeEmailConfirmToken }

