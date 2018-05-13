const roles = require('./roles')

module.exports = {
  [roles.superadmin]: [
    // [roles.superadmin] have all permissions
    // so we don't need to list it
    // just check [roles.superadmin] in checkAccessService
  ],

  [roles.admin]: [
    'posts:list',
    'posts:create',
    'posts:update',
    'posts:get-by-id'
  ],

  [roles.moderator]: [
    'posts:list',
    'posts:create',
    'posts:update',
    'posts:get-by-id'
  ],

  [roles.editor]: [
    'posts:list',
    'posts:create',
    'posts:update',
    'posts:get-by-id'
  ],

  [roles.user]: [
    'posts:list',
    'posts:create',
    'posts:update',
    'posts:get-by-id'
  ],

  [roles.anonymous]: [
    'posts:list',
    'posts:get-by-id'
  ]
}
