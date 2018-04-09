const ErrorWrapper = require('../../util/Error')

/**
 * @description check is logged in user status
 * @param {Object} user
 */
module.exports = user => {
  __typecheck(user, 'Object', true)

  return new Promise((resolve, reject) => {
    if (user.id) return resolve()
    return reject(new ErrorWrapper('Anonymous user. Access denied', 403))
  })
}
