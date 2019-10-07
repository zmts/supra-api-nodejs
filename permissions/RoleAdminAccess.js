const BaseRoleAccess = require('./BaseRoleAccess')

class RoleAdminAccess extends BaseRoleAccess {
  static get can () {
    return { ...this.basePermissions }
  }
}

module.exports = RoleAdminAccess
