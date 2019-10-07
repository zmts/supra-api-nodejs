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
      'users:confirm-email',
      'users:send-email-confirm-token',
      'users:send-reset-password-email',
      'users:reset-password',

      'posts:all',

      'auth:logout',
      'auth:logout-all-sessions'
    ]
  }
}

module.exports = BaseRoleAccess

