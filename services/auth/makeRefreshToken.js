const jwtp = require('./jwtp')
const SECRET = require('../../config').token.refresh

module.exports = userEntity => {
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
}
