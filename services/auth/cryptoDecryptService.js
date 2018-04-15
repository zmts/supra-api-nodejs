const crypto = require('crypto')

const ENCRYPTION_KEY = require('../../config/token').encryptkey
const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

/**
 * @return {string}
 */
module.exports = str => {
  __typecheck(str, 'String', true)

  return new Promise((resolve, reject) => {
    try {
      let strings = str.split('::')
      let iv = new Buffer(strings.shift(), 'hex')
      let encryptedString = new Buffer(strings.join('::'), 'hex')
      let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv)
      let decrypted = decipher.update(encryptedString)
      decrypted = Buffer.concat([decrypted, decipher.final()])

      return resolve(decrypted.toString())
    } catch (error) {
      return reject(new ErrorWrapper({ ...errorCodes.DECRYPTION, message: error.message }))
    }
  })
}

