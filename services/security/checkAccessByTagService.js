const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const permissions = require('../../config').permissions
const roles = require('../../config').roles
const registry = require('../../registry')
const validateRoleType = require('./util').validateRoleType

/**
 * @description check permissions to action by access tag
 * @param {String} accessTag
 */
module.exports = accessTag => {
  __typecheck(accessTag, 'String', true)

  let user = registry.getCurrentUser()

  return new Promise((resolve, reject) => {
    validateRoleType(reject)
    // pass superadmin
    if (user.role === roles.superadmin) return resolve()
    // check other roles
    if (permissions[user.role].includes(accessTag)) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}
