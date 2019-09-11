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

const logger = require('./util/logger')

module.exports = () => {
  global.__logger = logger
}
