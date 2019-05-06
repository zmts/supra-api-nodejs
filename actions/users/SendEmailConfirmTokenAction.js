const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const { makeEmailConfirmTokenService } = require('../../services/auth')

class SendEmailConfirmTokenAction extends BaseAction {
  static get accessTag () {
    return 'users:send-email-confirm-token'
  }

  static async run (req, res) {
    const { currentUser } = req

    const emailConfirmToken = await makeEmailConfirmTokenService(currentUser)
    await UserDAO.BaseUpdate(currentUser.id, { emailConfirmToken })
    await emailClient.send({
      to: currentUser.email,
      subject: 'Confirm email | supra.com!',
      text: `To confirm email: ${currentUser.email} please follow this link >> ${emailConfirmToken}`
    })

    res.json(this.resJson({ message: 'Email confirmation token was send!' }))
  }
}

module.exports = SendEmailConfirmTokenAction
