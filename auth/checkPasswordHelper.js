const bcrypt = require('bcryptjs')
const { errorCodes, ErrorWrapper, assert } = require('supra-core')

/**
 * @description make from req.body.password hash and compare it with existing password hash
 * @return {Promise} true/Error
 */
module.exports = (password, hash) => {
  assert.string(password, { notEmpty: true })
  assert.string(hash, { notEmpty: true })

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, result) => {
      if (error) return reject(new ErrorWrapper(error))
      if (!result) return reject(new ErrorWrapper({ ...errorCodes.INVALID_PASSWORD }))
      return resolve(result)
    })
  })
}
