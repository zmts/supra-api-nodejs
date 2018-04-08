const _jwtService = require('./_jwtService')
const _cryptoService = require('./_cryptoService')

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
      expiresIn: '60m'
    }
  }

  return _jwtService.sign(config.payload, SECRET, config.options)
    .then(result => _cryptoService.encrypt(result))
    .catch(error => {
      throw new Error(error)
    })
}
