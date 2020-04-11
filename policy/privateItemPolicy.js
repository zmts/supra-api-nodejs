const { errorCodes, AppError, assert } = require('supra-core')
const roles = require('../permissions/roles')

/**
 * @description check access to model by id
 * @public_access any user
 * @private_access owner, superadmin
 * @case get model by id
 * @returns {Promise} model
 */
module.exports = (model, currentUser) => {
  assert.object(model, { required: true })
  assert.object(currentUser, { required: true })

  return new Promise((resolve, reject) => {
    // pass to superadmin
    if (currentUser.role === roles.superadmin) return resolve(model)
    // pass to owner
    if (currentUser.id === model.userId) return resolve(model)
    // pass if model is public
    if (!model.private) return resolve(model)
    // reject if model is private
    if (model.private) {
      return reject(new AppError({ ...errorCodes.FORBIDDEN, message: `User ${currentUser.id} don't have access to model ${model.id}` }))
    }
    // else reject
    return reject(new AppError({ ...errorCodes.FORBIDDEN }))
  })
}

