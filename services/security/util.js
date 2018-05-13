const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config').errorCodes
const roles = require('../../config').roles
const registry = require('../../registry')

module.exports = {
  validateRoleType: reject => {
    let user = registry.getCurrentUser()

    if (!Object.values(roles).some(item => item === user.role)) {
      return reject(new ErrorWrapper({ ...errorCodes.BAD_ROLE }))
    }
  }
}
