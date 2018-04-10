const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

/**
 * @description check action permissions
 * @param {Object} user
 * @param {Object} permissions
 */
module.exports = (user, permissions) => {
  __typecheck(user, 'Object', true)
  __typecheck(permissions, 'Object', true)

  return new Promise((resolve, reject) => {
    if (user.isOwner) return resolve()
    if (permissions[user.role]) return resolve()
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}
