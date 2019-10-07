const BaseRoleAccess = require('./BaseRoleAccess')

class RoleEditorAccess extends BaseRoleAccess {
  static get can () {
    return { ...this.basePermissions }
  }
}

module.exports = RoleEditorAccess
