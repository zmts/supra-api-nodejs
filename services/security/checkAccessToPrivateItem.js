const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const roles = require('../../config').roles
const registry = require('../../registry')

/**
 * @description check access to model by id
 * @public_access any user
 * @private_access owner, superadmin
 * @case get model by id
 * @param {Object} model
 * @returns {Promise} model
 */
module.exports = model => {
  __typecheck(model, 'Object', true)

  let user = registry.getCurrentUser()

  return new Promise((resolve, reject) => {
    // pass to superadmin
    if (user.role === roles.superadmin) return resolve(model)
    // pass to owner
    if (user.id === model.userId) return resolve(model)
    // pass if model is public
    if (!model.private) return resolve(model)
    // reject if model is private
    if (model.private) {
      return reject(new ErrorWrapper({ ...errorCodes.ACCESS, message: `User ${user.id} don't have access to model ${model.id}` }))
    }
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}

