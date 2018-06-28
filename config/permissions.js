const roles = require('./roles')

const usersRegularPermissions = [ // all, except creation
  'users:list',
  'users:update',
  'users:get-by-id',
  'users:remove',
  'users:change-password'
]

module.exports = {
  [roles.superadmin]: [
    // [roles.superadmin] have all permissions
    // so we don't need to list it
    // just check [roles.superadmin] in access services
  ],

  [roles.admin]: [
    ...usersRegularPermissions,

    'posts:all'
  ],

  [roles.moderator]: [
    ...usersRegularPermissions,

    'posts:all'
  ],

  [roles.editor]: [
    ...usersRegularPermissions,

    'posts:all'
  ],

  [roles.user]: [
    ...usersRegularPermissions,

    'posts:all'
  ],

  [roles.anonymous]: [
    'users:list',
    'users:get-by-id',
    'users:create',
    'users:send-reset-email',
    'users:reset-password',

    'posts:list',
    'posts:get-by-id'
  ]
}
