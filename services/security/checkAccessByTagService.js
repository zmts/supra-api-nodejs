const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const permissions = require('../../config').permissions
const roles = require('../../config').roles
const registry = require('../../registry')

/**
 * @description check permissions to action by access tag
 * @param {String} accessTag
 */
module.exports = accessTag => {
  __typecheck(accessTag, 'String', true)

  let accessTagBaseName = accessTag.split(':')[0]
  let accessTagAll = `${accessTagBaseName}:all`
  let user = registry.getCurrentUser()

  return new Promise((resolve, reject) => {
    // pass superadmin
    if (user.role === roles.superadmin) return resolve()
    // if current user role have access tag >> pass
    if (permissions[user.role].includes(accessTagAll)) return resolve()
    if (permissions[user.role].includes(accessTag)) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}
