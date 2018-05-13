const roles = require('./config').roles
const ErrorWrapper = require('./util/ErrorWrapper')
const errorCodes = require('./config').errorCodes

class Registry {
  constructor () {
    this._registry = new Map()
  }

  get (key) {
    __typecheck(key, 'String', true)

    return this._registry.get(key)
  }

  set (key, value) {
    __typecheck(key, 'String', true)
    __typecheck(value, '*', true)

    this._registry.set(key, value)
  }

  getCurrentUser () {
    return this._registry.get('user') || {
      id: null,
      name: null,
      role: roles.anonymous,
      email: null,
      expiresIn: null
    }
  }

  setCurrentUser (user) {
    __typecheck(user, 'Object', true)
    this.validateUserRole(user.userRole)

    this._registry.set('user', {
      id: +user.sub,
      name: user.username,
      role: user.userRole,
      email: user.email,
      expiresIn: user.exp
    })
  }

  resetCurrentUser () {
    this._registry.set('user', null)
  }

  validateUserRole (userRole) {
    // throw error if user role type not exist
    if (!Object.values(roles).some(item => item === userRole)) {
      throw new ErrorWrapper({ ...errorCodes.BAD_ROLE })
    }
  }

  list () {
    return this._registry
  }
}

module.exports = new Registry()
