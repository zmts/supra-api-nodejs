const BaseRoleAccess = require('./BaseRoleAccess')

class RoleUserAccess extends BaseRoleAccess {
  static get can () {
    return { ...this.basePermissions }
  }
}

module.exports = RoleUserAccess
