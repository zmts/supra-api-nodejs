const roles = require('../config').roles
const ErrorWrapper = require('../util/ErrorWrapper')
const errorCodes = require('../config').errorCodes

class CurrentUserRegistry {
  constructor () {
    this._default = {
      id: null,
      name: null,
      role: roles.anonymous,
      email: null,
      expiresIn: null
    }
    this._user = this._default
  }
  get user () {
    return this._user
  }

  set user (user) {
    __typecheck(user, 'Object', true)
    this.validateUserRole(user.userRole)

    this._user = {
      id: +user.sub,
      name: user.username,
      role: user.userRole,
      email: user.email,
      expiresIn: user.exp
    }
  }

  reset () {
    this._user = this._default
  }

  validateUserRole (userRole) {
    // throw error if user role type not exist
    if (!Object.values(roles).some(item => item === userRole)) {
      throw new ErrorWrapper({ ...errorCodes.BAD_ROLE })
    }
  }

  list () {
    return this._user
  }
}

module.exports = CurrentUserRegistry
