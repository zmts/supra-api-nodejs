const typeCheck = require('type-check').typeCheck
const ErrorWrapper = require('./Error')

/**
 * validate function arguments by related schema
 * @param args
 * @param schema
 */
module.exports = (args, schema) => {
  let schemaLocal = []
  if (schema === 'default') {
    schemaLocal = [
      { type: 'Object', required: true },
      { type: 'Object', required: true },
      { type: 'Function', required: true }
    ]
  } else {
    schemaLocal = schema
  }
  /**
   * check required arguments
   */
  let schemaRequiredCount = schemaLocal.filter(item => item.required).length
  if (args.length < schemaRequiredCount) {
    throw new ErrorWrapper('Required parameters not supplied', 500)
  }
  /**
   * check arguments type
   */
  Array.from(args).forEach((actualArgumentValue, actualArgumentIndex) => {
    if (!typeCheck(schemaLocal[actualArgumentIndex].type, actualArgumentValue)) {
      throw new ErrorWrapper(`>> arguments[${actualArgumentIndex}] << wrong type`, 500)
    }
  })
}
