const jwtService = require('./jwtService')
const cryptoEncryptServiceSync = require('./cryptoEncryptServiceSync')

const SECRET = require('../../config').token.refresh

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
      expiresIn: '60m',
      subject: userEntity.id.toString()
    }
  }

  return jwtService.sign(config.payload, SECRET, config.options)
    .then(result => cryptoEncryptServiceSync(result))
    .catch(error => { throw new Error(error) })
}
