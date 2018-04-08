const jwtp = require('./jwtp')
const SECRET = require('../../config').token.access

module.exports = userEntity => {
  let config = {
    payload: {
      accessToken: true,
      username: userEntity.name,
      userRole: userEntity.role,
      email: userEntity.email
    },

    options: {
      algorithm: 'HS512',
      expiresIn: '1m',
      subject: userEntity.id.toString()
    }
  }

  return jwtp.sign(config.payload, SECRET, config.options)
}
