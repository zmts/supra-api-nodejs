const typeCheck = require('type-check').typeCheck
const ErrorWrapper = require('./ErrorWrapper')

/**
 * validate function argument
 */
module.exports = (argument, type, required) => {
  /**
   * check if required
   */
  if (required && !argument) {
    throw new ErrorWrapper('Required parameters not supplied', 500)
  }
  /**
   * check arguments type
   */
  const isArgumentExist = [null, false, NaN].includes(argument) || argument
  if (isArgumentExist && !typeCheck(type, argument)) {
    throw new ErrorWrapper('Argument wrong type', 500)
  }
}
