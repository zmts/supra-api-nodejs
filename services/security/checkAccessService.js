const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes

const permissions = require('../../config').permissions
const roles = require('../../config').roles
const registry = require('../../registry')

/**
 * @description check action permissions
 * @param {String} accessTag
 */
module.exports = accessTag => {
  __typecheck(accessTag, 'String', true)

  let user = registry.getCurrentUser()

  return new Promise((resolve, reject) => {
    // validate role type
    if (!Object.values(roles).some(item => item === user.role)) {
      return reject(new ErrorWrapper({ ...errorCodes.BAD_ROLE }))
    }
    // pass owner TODO
    // if (user.isOwner) return resolve()
    // pass superadmin
    if (user.role === roles.superadmin) return resolve()
    // check other roles
    if (permissions[user.role].includes(accessTag)) return resolve()
    // else reject
    return reject(new ErrorWrapper({ ...errorCodes.ACCESS }))
  })
}
