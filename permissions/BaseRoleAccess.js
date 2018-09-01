class BaseRoleAccess {
  static get usersResource () {
    return [ // all actions, except creation
      'users:list',
      'users:update',
      'users:get-by-id',
      'users:remove',
      'users:change-password',
      'user:get-posts-by-user-id',
      'users:send-email-confirm-token',
      'users:change-email'
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
