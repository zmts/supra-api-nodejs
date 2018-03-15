const required = require('./util/required')
const typecheck = require('./util/typecheck')

module.exports = () => {
  global.required = required
  global.typecheck = typecheck
}
