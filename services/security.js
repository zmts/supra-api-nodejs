const ErrorWrapper = require('../util/Error')

/**
 * @description check is logged in user status
 * @param {Object} user
 */
module.exports.isLoggedIn = (user) => {
  __typecheck(user, 'Object', true)

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
  __typecheck(user, 'Object', true)
  __typecheck(permissions, 'Object', true)

  return new Promise((resolve, reject) => {
    if (user.isOwner) return resolve()
    if (permissions[user.role]) return resolve()
    return reject(new ErrorWrapper('Access denied', 403))
  })
}
