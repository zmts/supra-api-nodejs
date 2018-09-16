const roles = require('../config').roles
const ErrorWrapper = require('../util/ErrorWrapper')
const errorCodes = require('../config').errorCodes

const $private = Symbol()

class CurrentUserRegistry {
  constructor () {
    this[$private] = {
      user: {},
      default: {
        id: null,
        name: null,
        role: roles.anonymous,
        email: null,
        expiresIn: null
      }
    }
    this[$private].user = this[$private].default
  }
  get user () {
    return this[$private].user
  }

  set user (user) {
    __typecheck(user, __type.object, true)
    this.validateUserRole(user.userRole)

    this[$private].user = {
      id: +user.sub,
      name: user.username,
      role: user.userRole,
      email: user.email,
      expiresIn: user.exp
    }
  }

  reset () {
    this[$private].user = this[$private].default
  }

  validateUserRole (userRole) {
    // throw error if user role type not exist
    if (!Object.values(roles).some(item => item === userRole)) {
      throw new ErrorWrapper({ ...errorCodes.BAD_ROLE })
    }
  }

  list () {
    return this[$private].user
  }
}

module.exports = CurrentUserRegistry
