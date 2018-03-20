const typeCheck = require('type-check').typeCheck
const ErrorWrapper = require('./Error')

/**
 * validate function argument
 */
module.exports.main = (argument, type, required) => {
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

/**
 * middleware type check (req, res, next)
 */
module.exports.middleware = (req, res, next) => {
  if (!typeCheck('Object', req)) {
    throw new ErrorWrapper('req argument wrong type', 500)
  }
  if (!typeCheck('Object', res)) {
    throw new ErrorWrapper('res argument wrong type', 500)
  }
  if (next && !typeCheck('Function', next)) {
    throw new ErrorWrapper('next  argument wrong type', 500)
  }
}
