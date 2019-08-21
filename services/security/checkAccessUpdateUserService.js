const { errorCodes, ErrorWrapper } = require('../../core')
const roles = require('../../config').roles

/**
 * @description model id === current user id
 * @access owner, superadmin
 * @case update user model
 */
module.exports = (model, currentUser) => {
  __typecheck(model, 'Object', true)
  __typecheck(currentUser, __type.object, true)

  return new Promise((resolve, reject) => {
    // pass superadmin
    if (currentUser.role === roles.superadmin) return resolve()
    // pass owner
    if (currentUser.id === model.id) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}

