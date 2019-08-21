const { errorCodes, ErrorWrapper } = require('supra-core')

const roles = require('../../config').roles

/**
 * @description model userId === current user id
 * @access owner, superadmin
 * @case update or delete model
 */
module.exports = (model, currentUser) => {
  __typecheck(model, 'Object', true)
  __typecheck(currentUser, __type.object, true)

  return new Promise((resolve, reject) => {
    // pass superadmin
    if (currentUser.role === roles.superadmin) return resolve()
    // pass owner
    if (currentUser.id === model.userId) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}

