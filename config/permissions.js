const roles = require('./roles')

module.exports = {
  [roles.superadmin]: [
    // [roles.superadmin] have all permissions
    // so we don't need to list it
    // just check [roles.superadmin] in checkAccessService
  ],

  [roles.admin]: [
    'posts:all'
  ],

  [roles.moderator]: [
    'posts:all'
  ],

  [roles.editor]: [
    'posts:all'
  ],

  [roles.user]: [
    'posts:all'
  ],

  [roles.anonymous]: [
    'posts:list',
    'posts:get-by-id'
  ]
}
