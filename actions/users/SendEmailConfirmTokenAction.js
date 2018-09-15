const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { makeEmailConfirmTokenService } = require('../../services/auth')
const registry = require('../../registry')
const sendEmailService = require('../../services/sendEmailService')

class SendEmailConfirmTokenAction extends BaseAction {
  static get accessTag () {
    return 'users:send-email-confirm-token'
  }

  static async run (req, res) {
    const currentUser = registry.currentUser.get()
    const emailConfirmToken = await makeEmailConfirmTokenService(currentUser)
    await UserDAO.BaseUpdate(currentUser.id, { emailConfirmToken })
    await sendEmailService({
      to: currentUser.email,
      subject: 'Confirm email | supra.com!',
      text: `To confirm email: ${currentUser.email} please follow this link >> ${emailConfirmToken}`
    })
    res.json(this.resJson({ message: 'Email confirmation token was send!' }))
  }
}

module.exports = SendEmailConfirmTokenAction
