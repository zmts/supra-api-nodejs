const roles = require('./roles')

module.exports = {
  [roles.superadmin]: [
    // [roles.superadmin] have all permissions
    // so we don't need to list it
    // just check [roles.superadmin] in checkAccessService
  ],

  [roles.admin]: [
    'posts:list'
  ],

  [roles.moderator]: [
    'posts:list'
  ],

  [roles.editor]: [
    'posts:list'
  ],

  [roles.user]: [
    'posts:list'
  ],

  [roles.guest]: [
    //
  ]
}
