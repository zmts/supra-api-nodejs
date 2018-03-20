const required = require('./util/required')
const typecheck = require('./util/typecheck')
const typechecker = require('./util/typechecker')

module.exports = () => {
  global.required = required
  global.typecheck = typecheck
  global.typechecker = {
    main: typechecker.main,
    middleware: typechecker.middleware
  }
}
