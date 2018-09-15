class BaseRoleAccess {
  static get usersResource () {
    return [ // all action tags, except creation
      // usersActions.ListAction.accessTag,
      // usersActions.UpdateAction.accessTag,
      // usersActions.GetByIdAction.accessTag,
      // usersActions.RemoveAction.accessTag,
      // usersActions.ChangePasswordAction.accessTag,
      // usersActions.GetPostsByUserIdAction.accessTag,
      // usersActions.SendEmailConfirmTokenAction.accessTag,
      // usersActions.ChangeEmailAction.accessTag
      'users:list',
      'users:update',
      'users:get-by-id',
      'users:remove',
      'users:change-password',
      'user:get-posts-by-user-id',
      'users:send-email-confirm-token',
      'users:change-email',
      'users:get-current-user'
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

