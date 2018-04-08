const jwtp = require('./_jwtp')
const crypto = require('./_crypto')
const parseTokenData = require('./_parseTokenData')

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

  return jwtp.sign(config.payload, SECRET, config.options)
    .then(result => {
      tokenObj.accessToken = crypto.encrypt(result)
      return result
    })
    .then(result => parseTokenData(result))
    .then(parsedTokenObj => (tokenObj.expiresIn = parsedTokenObj.exp))
    .then(() => tokenObj)
    .catch(error => {
      throw new Error(error)
    })
}
