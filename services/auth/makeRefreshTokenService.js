const jwtService = require('./jwtService')

const SECRET = require('../../config').token.refresh.secret
const expiresIn = require('../../config').token.refresh.expiresIn
const type = require('../../config').token.refresh.type

/**
 * @return {Promise} string
 */
module.exports = async (userEntity) => {
  __typecheck(userEntity, 'Object', true)

  const config = {
    payload: {
      tokenType: type,
      email: userEntity.email
    },

    options: {
      algorithm: 'HS512',
      subject: userEntity.id.toString(),
      expiresIn
    }
  }

  const timestamp = new Date().getTime()
  const token = await jwtService.sign(config.payload, SECRET, config.options)
  return `${timestamp}::${token}`
}
