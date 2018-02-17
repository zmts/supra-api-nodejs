const ErrorWrapper = require('../util/Error')

/**
 * @description check is logged in user status
 * @param {Object} user
 */
module.exports.isLoggedIn = (user = global.required()) => {
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
module.exports.checkAccess = (user = global.required(), permissions = global.required()) => {
  return new Promise((resolve, reject) => {
    if (user.isOwner) return resolve()
    if (permissions[user.role]) return resolve()
    return reject(new ErrorWrapper('Access denied', 403))
  })
}
