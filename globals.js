const typecheck = require('./util/typecheck')
const type = require('./util/type')

module.exports = () => {
  global.__typecheck = typecheck
  global.__type = type
  global.__rootdir = __dirname
}
