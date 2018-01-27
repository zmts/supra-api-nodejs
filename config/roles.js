module.exports = {
  /**
   * roles:
   * 'superuser' - have access to any endpoint
   * 'adminRoles' - have access to any endpoints, except for 'changeUserRole' endpoint
   * 'editorRoles' - have access to any items created by 'user' role Don't have permissions to user Profile
   * 'user' - have access to any public endpoints and own items and profile
   * 'anonymous' - have access only to public endpoints
   */
  roles: {
    superuser: 'superuser',
    adminRoles: ['superuser', 'moderator'],
    editorRoles: ['author', 'photo-author'],
    user: 'user'
  }
}
