const roles = require('./roles')

module.exports = {
  [roles.superadmin]: [
    // [roles.superadmin] have all permissions
    // so we don't need to list it
    // just check [roles.superadmin] in checkAccessService
  ],

  [roles.admin]: [
    'posts:all',

    'users:list',
    'users:update',
    'users:get-by-id',
    'users:remove'
  ],

  [roles.moderator]: [
    'posts:all',

    'users:list',
    'users:update',
    'users:get-by-id',
    'users:remove'
  ],

  [roles.editor]: [
    'posts:all',

    'users:list',
    'users:update',
    'users:get-by-id',
    'users:remove'
  ],

  [roles.user]: [
    'posts:all',

    'users:list',
    'users:update',
    'users:get-by-id',
    'users:remove'
  ],

  [roles.anonymous]: [
    'posts:list',
    'posts:get-by-id',

    'users:list',
    'users:get-by-id',
    'users:create'
  ]
}
