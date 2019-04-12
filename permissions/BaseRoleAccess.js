class BaseRoleAccess {
  static get usersResource () {
    return [
      'users:list',
      'users:update',
      'users:get-by-id',
      'users:remove',
      'users:change-password',
      'users:send-email-confirm-token',
      'users:change-email',
      'users:get-current-user'
    ]
  }

  static get basePermissions () {
    return [
      ...this.usersResource,
      'posts:all',
      'auth:logout'
    ]
  }
}

module.exports = BaseRoleAccess

