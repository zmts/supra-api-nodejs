const jwtService = require('./jwtService')

const SECRET = require('../../config').token.confirmEmail.secret
const expiresIn = require('../../config').token.confirmEmail.expiresIn
const type = require('../../config').token.type.confirmEmail.type

/**
 * @return {Promise} string
 */
module.exports = userEntity => {
  __typecheck(userEntity, 'Object', true)

  let config = {
    payload: {
      tokenType: type,
      email: userEntity.email
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id.toString(),
      expiresIn
    }
  }

  return jwtService.sign(config.payload, SECRET, config.options)
}
