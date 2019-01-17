/**
 ******************************
 ******************************
 ******************************
 * Globals is anti pattern
 * Use it very careful
 ******************************
 ******************************
 ******************************
 */

const typecheck = require('./util/typecheck')
const type = require('./util/type')
const logger = require('./util/logger')

module.exports = () => {
  global.__typecheck = typecheck
  global.__type = type
  global.__rootdir = __dirname
  global.__logger = logger
}
