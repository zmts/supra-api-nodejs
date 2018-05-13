const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const roles = require('../../config').roles
const registry = require('../../registry')
const validateRoleType = require('./util').validateRoleType

/**
 * @description to private item have access only owner and superadmin
 * @param {Object} model
 * @returns {Promise} model
 */
module.exports = model => {
  __typecheck(model, 'Object', true)

  let user = registry.getCurrentUser()

  return new Promise((resolve, reject) => {
    validateRoleType(reject)
    // pass to superadmin
    if (user.role === roles.superadmin) return resolve(model)
    // anyway pass to owner
    if (user.id === model.userId) return resolve(model)
    // pass model to other users if model is public
    if ((user.id !== model.userId) && !model.private) return resolve(model)
    // reject if model is private and user don't have access to it
    if ((user.id !== model.userId) && model.private) {
      return reject(new ErrorWrapper({ ...errorCodes.ACCESS, message: `User ${user.id} don't have access to model ${model.id}` }))
    }
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}

