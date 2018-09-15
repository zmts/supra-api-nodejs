const typeCheck = require('type-check').typeCheck
const ErrorWrapper = require('./ErrorWrapper')
const errorCodes = require('../config/errorCodes')

/**
 * validate function argument
 */
module.exports = (argument, type, required, message) => {
  /**
   * check if required
   */
  if ((required && !argument) && (argument !== 0)) {
    if (!message) throw new ErrorWrapper({ ...errorCodes.NO_ARGUMENT })
    throw new ErrorWrapper({ ...errorCodes.NO_ARGUMENT, message })
  }
  /**
   * check arguments type
   */
  const isArgumentExist = [0, null, false, NaN].includes(argument) || argument
  if (isArgumentExist && !typeCheck(type, argument)) {
    if (!message) throw new ErrorWrapper({ ...errorCodes.ARGUMENT_TYPE })
    throw new ErrorWrapper({ ...errorCodes.ARGUMENT_TYPE, message })
  }
}
