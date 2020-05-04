const { AppError, errorCodes } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { emailAgent } = require('../../RootProvider')
const { UserDAO } = require('../../../dao/UserDAO')
const { makeEmailConfirmToken } = require('../common/makeEmailConfirmToken')
const { ChangeEmail } = require('../common/emails/ChangeEmail')

class ResendConfirmNewEmailTokenAction extends BaseAction {
  static get accessTag () {
    return 'users:resend-confirm-new-email-token'
  }

  static async run (ctx) {
    const { currentUser } = ctx

    const user = await UserDAO.baseGetById(currentUser.id)
    if (!user.newEmail) {
      throw new AppError({ ...errorCodes.NOT_FOUND, message: 'There is no new email confirmation.' })
    }
    const { newEmail } = user

    const emailConfirmToken = await makeEmailConfirmToken(user)
    await emailAgent.send(new ChangeEmail({ newEmail, emailConfirmToken }))
    await UserDAO.baseUpdate(currentUser.id, { emailConfirmToken })

    return this.result({ message: 'Email confirmation token was send!' })
  }
}

module.exports = { ResendConfirmNewEmailTokenAction }
