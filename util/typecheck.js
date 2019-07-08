const { typeCheck } = require('type-check')
const ErrorWrapper = require('../core/ErrorWrapper')
const errorCodes = require('../config/errorCodes')

/**
 * validate function argument
 */
module.exports = (argument, type, required, message) => {
  /**
   * check if required
   */
  if (required && (argument === undefined)) {
    throw new ErrorWrapper({
      ...errorCodes.NO_ARGUMENT,
      message: message || errorCodes.NO_ARGUMENT.message
    })
  }
  /**
   * check arguments type
   */
  const isArgumentExist = [0, null, false, NaN].includes(argument) || argument
  // if argument is number or number as string transform it into Number
  const getArgument = type === __type.number ? Number(argument) : argument
  if (isArgumentExist && !typeCheck(type, getArgument)) {
    if (!message) {
      throw new ErrorWrapper({
        ...errorCodes.ARGUMENT_TYPE,
        message: `Wrong argument. Expected '${type.toLowerCase()}' type. Got '${typeof argument}' type.`
      })
    }
    throw new ErrorWrapper({ ...errorCodes.ARGUMENT_TYPE, message })
  }

  return { message: 'All fine. Type is OK' }
}
