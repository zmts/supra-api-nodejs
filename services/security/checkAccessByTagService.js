const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const permissions = require('../../config').permissions
const roles = require('../../config').roles
const registry = require('../../registry')

/**
 * @description check permissions to action by access tag
 * @case uses in each action class
 * @param {String} accessTag
 */
module.exports = accessTag => {
  __typecheck(accessTag, 'String', true)

  let accessTagBaseName = accessTag.split(':')[0]
  let accessTagAll = `${accessTagBaseName}:all`
  let currentUser = registry.currentUser.get()

  return new Promise((resolve, reject) => {
    // pass superadmin
    if (currentUser.role === roles.superadmin) return resolve()
    // if current user role have access tag >> pass
    if (permissions[currentUser.role].includes(accessTagAll)) return resolve()
    if (permissions[currentUser.role].includes(accessTag)) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}
