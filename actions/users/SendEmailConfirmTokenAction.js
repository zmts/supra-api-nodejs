const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { makeEmailConfirmTokenService } = require('../../services/auth')
const registry = require('../../registry')
const sendEmailService = require('../../services/sendEmailService')

class SendEmailConfirmToken extends BaseAction {
  static get accessTag () {
    return 'users:send-email-confirm-token'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static run (req, res, next) {
    let currentUser = registry.currentUser.get()
    let emailConfirmToken = ''

    this.init(req, this.validationRules, this.accessTag)
      .then(() => makeEmailConfirmTokenService(currentUser))
      .then(token => {
        emailConfirmToken = token
        return UserDAO.BaseUpdate(currentUser.id, { emailConfirmToken })
      })
      .then(() => sendEmailService({
        to: currentUser.email,
        subject: 'Confirm email | supra.com!',
        text: `To confirm email: ${currentUser.email} please follow this link >> ${emailConfirmToken}`
      }))
      .then(() => res.json(this.resJson({ message: 'Email confirmation token was send!' })))
      .catch(error => next(error))
  }
}

module.exports = SendEmailConfirmToken
