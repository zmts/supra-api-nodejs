const _ = require('lodash')
const ErrorWrapper = require('../util/Error')

module.exports = (actualArguments, schema) => {
  /**
   * check required arguments
   */
  let schemaRequiredCount = schema.filter(item => item.required).length
  if (actualArguments.length < schemaRequiredCount) {
    throw new ErrorWrapper('Required parameters not supplied', 500)
  }

  /**
   * check arguments type
   */
  _.forEach(actualArguments, (actualArgumentsItem, actualArgumentsIndex) => {
    let actualArgumentType = typeof actualArgumentsItem

    if (actualArgumentType !== schema[actualArgumentsIndex].type) {
      throw new ErrorWrapper(`>> ${schema[actualArgumentsIndex].name} << parameter wrong type`, 500)
    }
  })
}
