const ErrorWrapper = require('./Error')

module.exports = (args, schema) => {
  /**
   * check required arguments
   */
  let schemaRequiredCount = schema.filter(item => item.required).length
  if (args.length < schemaRequiredCount) {
    throw new ErrorWrapper('Required parameters not supplied', 500)
  }
  /**
   * check arguments type
   */
  Array.from(args).forEach((actualArgumentsItem, actualArgsIndex) => {
    let actualArgumentType = typeof actualArgumentsItem

    if (actualArgumentType !== schema[actualArgsIndex].type) {
      throw new ErrorWrapper(`>> ${schema[actualArgsIndex].name} << parameter wrong type`, 500)
    }
  })
}
