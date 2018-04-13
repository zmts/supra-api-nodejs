const jwtService = require('./jwtService')
const { encrypt } = require('./cryptoService')

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
    .then(result => encrypt(result))
    .catch(error => { throw new Error(error) })
}
