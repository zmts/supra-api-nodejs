const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const roles = require('../../config').roles
const registry = require('../../registry')

/**
 * @description model id === current user id
 * @access owner, superadmin
 * @case update user model
 * @param {Object} model
 */
module.exports = model => {
  __typecheck(model, 'Object', true)

  const currentUser = registry.currentUser.user

  return new Promise((resolve, reject) => {
    // pass superadmin
    if (currentUser.role === roles.superadmin) return resolve()
    // pass owner
    if (currentUser.id === model.id) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}

