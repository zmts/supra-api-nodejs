class RoleAnonymousAccess {
  static get can () {
    return [
      'users:list',
      'users:get-by-id',
      'users:create',
      'users:send-reset-email',
      'users:reset-password',
      'users:get-posts-by-user-id',
      'users:confirm-email',

      'auth:login',
      'auth:refresh-tokens',

      'posts:list',
      'posts:get-by-id'
    ]
  }
}

module.exports = RoleAnonymousAccess
