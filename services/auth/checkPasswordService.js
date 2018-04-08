const bcrypt = require('bcryptjs')
const ErrorWrapper = require('../../util/Error')

/**
 * @return {Promise} true/Error
 */
module.exports = (password, hash) => {
  __typecheck(password, 'String', true)
  __typecheck(hash, 'String', true)

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, result) => {
      if (error) return reject(new ErrorWrapper(error))
      if (!result) return reject(new ErrorWrapper('Invalid password', 403))
      return resolve(result)
    })
  })
}
