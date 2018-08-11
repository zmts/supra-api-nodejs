const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')
const registry = require('../../registry')

/**
 * @description check is logged in user status
 */
module.exports = () => {
  let currentUser = registry.currentUser.get()

  return new Promise((resolve, reject) => {
    if (currentUser.id) return resolve()
    return reject(new ErrorWrapper({ ...errorCodes.NO_ANONYMOUS_ACCESS }))
  })
}
