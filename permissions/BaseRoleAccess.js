class BaseRoleAccess {
  static get basePermissions () {
    return [
      'users:list',
      'users:update',
      'users:get-by-id',
      'users:remove',
      'users:change-password',
      'users:send-email-confirm-token',
      'users:change-email',
      'users:get-current-user',

      'posts:all',
      'auth:logout'
    ]
  }
}

module.exports = BaseRoleAccess

