const { ErrorWrapper } = require('../util/error')

/**
 * @description check is logged in user status
 * @param user
 */
module.exports.isLoggedIn = (user) => {
  return new Promise((resolve, reject) => {
    if (user.id) return resolve()
    return reject(new ErrorWrapper('Anonymous user. Access denied', 403))
  })
}

/**
 * @description check action permissions
 * @param user
 * @param permissions
 */
module.exports.checkAccess = (user, permissions) => {
  return new Promise((resolve, reject) => {
    if (user.isOwner) return resolve()
    if (permissions[user.role]) return resolve()
    return reject(new ErrorWrapper('Access denied', 403))
  })
}
