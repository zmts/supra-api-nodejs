const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

/**
 * @description check is logged in user status
 * @param {Object} user
 */
module.exports = user => {
  __typecheck(user, 'Object', true)

  return new Promise((resolve, reject) => {
    if (user.id) return resolve()
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}
