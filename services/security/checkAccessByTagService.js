const ErrorWrapper = require('../../core/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const permissions = require('../../permissions')
const roles = require('../../config').roles

/**
 * @description check permissions to action by access tag
 * @case uses in each action class
 */
module.exports = (accessTag, currentUser) => {
  __typecheck(accessTag, __type.string, true)
  __typecheck(currentUser, __type.object, true)

  const accessTagBaseName = accessTag.split(':')[0]
  const accessTagAll = `${accessTagBaseName}:all`

  return new Promise((resolve, reject) => {
    // pass superadmin
    if (currentUser.role === roles.superadmin) return resolve()
    // if current user role have access tag >> pass
    if (permissions[currentUser.role].includes(accessTagAll)) return resolve()
    if (permissions[currentUser.role].includes(accessTag)) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS, message: 'Access denied, don\'t have permissions.' }))
  })
}
