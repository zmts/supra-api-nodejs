const ErrorWrapper = require('../util/Error')

/**
 * @description check is logged in user status
 * @param {Object} user
 */
module.exports.isLoggedIn = (user) => {
  if (!user) throw new ErrorWrapper('\'isLoggedIn\' method requires \'user\' param', 500)

  return new Promise((resolve, reject) => {
    if (user.id) return resolve()
    return reject(new ErrorWrapper('Anonymous user. Access denied', 403))
  })
}

/**
 * @description check action permissions
 * @param {Object} user
 * @param {Object} permissions
 */
module.exports.checkAccess = (user, permissions) => {
  if (!user) throw new ErrorWrapper('\'checkAccess\' method requires \'user\' param', 500)
  if (!permissions) throw new ErrorWrapper('\'checkAccess\' method requires \'permissions\' param', 500)

  return new Promise((resolve, reject) => {
    if (user.isOwner) return resolve()
    if (permissions[user.role]) return resolve()
    return reject(new ErrorWrapper('Access denied', 403))
  })
}
