const jwtp = require('./_jwtp')
const crypto = require('./_crypto')

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

  return jwtp.sign(config.payload, SECRET, config.options)
    .then(result => crypto.encrypt(result))
    .catch(error => {
      throw new Error(error)
    })
}
