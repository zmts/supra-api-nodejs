const jwtHelper = require('./jwtHelper')

const SECRET = require('../../config').token.emailConfirm.secret
const expiresIn = require('../../config').token.emailConfirm.expiresIn
const type = require('../../config').token.emailConfirm.type
const iss = require('../../config').token.jwtIss

/**
 * @return {Promise} string
 */
module.exports = userEntity => {
  __typecheck(userEntity, 'Object', true)

  let config = {
    payload: {
      tokenType: type,
      email: userEntity.email,
      iss
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id.toString(),
      expiresIn
    }
  }

  return jwtHelper.sign(config.payload, SECRET, config.options)
}
