const typecheck = require('./util/typecheck')

module.exports = () => {
  global.__typecheck = typecheck
  global.__rootdir = __dirname
}
