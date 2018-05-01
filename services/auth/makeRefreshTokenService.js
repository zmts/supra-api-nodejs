const jwtService = require('./jwtService')
const cryptoEncryptService = require('./cryptoEncryptService')

const SECRET = require('../../config').token.refresh
const expiresIn = require('../../config').token.refreshExpiresIn

/**
 * @return {Promise} string
 */
module.exports = userEntity => {
  __typecheck(userEntity, 'Object', true)

  let config = {
    payload: {
      refreshToken: true,
      email: userEntity.email
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id.toString(),
      expiresIn
    }
  }

  return jwtService.sign(config.payload, SECRET, config.options)
    .then(result => cryptoEncryptService(result))
    .catch(error => { throw new Error(error) })
}
