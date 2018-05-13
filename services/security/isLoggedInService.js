const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')
const registry = require('../../registry')

/**
 * @description check is logged in user status
 */
module.exports = () => {
  let user = registry.getCurrentUser()

  return new Promise((resolve, reject) => {
    if (user.id) return resolve()
    return reject(new ErrorWrapper({ ...errorCodes.NO_ANONYMOUS_ACCESS }))
  })
}
