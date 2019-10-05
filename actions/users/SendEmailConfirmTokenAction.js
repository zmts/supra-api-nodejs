const { ErrorWrapper, errorCodes } = require('supra-core')
const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const { makeEmailConfirmTokenHelper } = require('../../auth')
const { app } = require('../../config')

class SendEmailConfirmTokenAction extends BaseAction {
  static get accessTag () {
    return 'users:send-email-confirm-token'
  }

  static async run (ctx) {
    const { currentUser } = ctx

    const user = await UserDAO.baseGetById(currentUser.id)
    if (!user.newEmail) {
      throw new ErrorWrapper({ ...errorCodes.NOT_FOUND, message: 'There is no new email confirmation.' })
    }
    const { newEmail } = user

    const emailConfirmToken = await makeEmailConfirmTokenHelper(user)
    await emailClient.send({
      to: newEmail,
      subject: 'Confirm email | supra.com!',
      text: `To confirm email: ${newEmail} please follow this link >> ${app.url}/frontend-spa/confirm-email?emailConfirmToken=${emailConfirmToken}`
    })
    await UserDAO.baseUpdate(currentUser.id, { emailConfirmToken })

    return this.result({ message: 'Email confirmation token was send!' })
  }
}

module.exports = SendEmailConfirmTokenAction
