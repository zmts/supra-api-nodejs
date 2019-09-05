const jwtHelper = require('./jwtHelper')

const SECRET = require('../../config').token.access.secret
const expiresIn = require('../../config').token.access.expiresIn
const type = require('../../config').token.access.type
const iss = require('../../config').token.jwtIss

/**
 * @return {Promise} string
 */
module.exports = userEntity => {
  __typecheck(userEntity, 'Object', true)

  let config = {
    payload: {
      tokenType: type,
      username: userEntity.name,
      userRole: userEntity.role,
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
