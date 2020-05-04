const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')

class CancelEmailChangingAction extends BaseAction {
  static get accessTag () {
    return 'users:cancel-email-changing'
  }

  static async run (ctx) {
    const { currentUser } = ctx
    await UserDAO.baseUpdate(currentUser.id, {
      newEmail: null,
      emailConfirmToken: null
    })

    return this.result({ message: 'Email changing canceled!' })
  }
}

module.exports = { CancelEmailChangingAction }
