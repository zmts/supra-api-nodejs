const roles = require('./roles')

const usersRegularPermissions = [ // all, except creation
  'users:list',
  'users:update',
  'users:get-by-id',
  'users:remove',
  'users:change-password',
  'user:get-posts-by-user-id',
  'users:send-email-confirm-token',
  'users:change-email'
]

module.exports = {
  [roles.superadmin]: [
    // [roles.superadmin] have all permissions
    // so we don't need to list it
    // just check [roles.superadmin] in access services
  ],

  [roles.admin]: [
    ...usersRegularPermissions,

    'posts:all',

    'auth:refresh-tokens',
    'auth:logout'
  ],

  [roles.moderator]: [
    ...usersRegularPermissions,

    'posts:all',

    'auth:refresh-tokens',
    'auth:logout'
  ],

  [roles.editor]: [
    ...usersRegularPermissions,

    'posts:all',

    'auth:refresh-tokens',
    'auth:logout'
  ],

  [roles.user]: [
    ...usersRegularPermissions,

    'posts:all',

    'auth:refresh-tokens',
    'auth:logout'
  ],

  [roles.anonymous]: [
    'users:list',
    'users:get-by-id',
    'users:create',
    'users:send-reset-email',
    'users:reset-password',
    'users:get-posts-by-user-id',
    'users:confirm-email',

    'auth:login',

    'posts:list',
    'posts:get-by-id'
  ]
}
