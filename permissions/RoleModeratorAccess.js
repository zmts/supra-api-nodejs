const BaseRoleAccess = require('./BaseRoleAccess')

class RoleModeratorAccess extends BaseRoleAccess {
  static get can () {
    return { ...this.basePermissions }
  }
}

module.exports = RoleModeratorAccess
