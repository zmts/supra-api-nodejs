const typeCheck = require('type-check').typeCheck
const ErrorWrapper = require('./Error')

module.exports = (args, schema) => {
  let schemaLocal = []
  if (schema === 'default') {
    schemaLocal = [
      { type: 'Object', name: 'req', required: true },
      { type: 'Object', name: 'res', required: true },
      { type: 'Function', name: 'next', required: true }
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
      throw new ErrorWrapper(`>> ${schemaLocal[actualArgumentIndex].name} << parameter wrong type`, 500)
    }
  })
}
