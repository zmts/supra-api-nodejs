const jwtService = require('./jwtService')
const cryptoEncryptService = require('./cryptoEncryptService')
const parseTokenService = require('./parseTokenService')

const SECRET = require('../../config').token.access

/**
 * @return {Promise} { accessToken: string, expiresIn: Number }
 */
module.exports = userEntity => {
  __typecheck(userEntity, 'Object', true)

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

  let tokenObj = { accessToken: '', expiresIn: '' }
  let accessTokenStr = ''

  return jwtService.sign(config.payload, SECRET, config.options)
    .then(token => {
      accessTokenStr = token
      return cryptoEncryptService(token)
    })
    .then(encryptedToken => (tokenObj.accessToken = encryptedToken))
    .then(() => parseTokenService(accessTokenStr))
    .then(parsedTokenObj => {
      tokenObj.expiresIn = parsedTokenObj.exp
      return tokenObj
    }).catch(error => { throw new Error(error) })
}
