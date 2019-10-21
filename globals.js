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

const logger = require('./logger')

module.exports = () => {
  global.__logger = logger
}
