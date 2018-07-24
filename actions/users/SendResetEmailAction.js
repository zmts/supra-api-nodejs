const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const authModule = require('../../services/auth')
const sendEmailService = require('../../services/sendEmailService')
// const registry = require('../../registry')

/**
 * 1) get email from request
 * 2) find user in DB by email
 * 3) generate and store resetEmailToken to DB
 * 4) send reset email
 */
class SendResetEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:send-reset-email'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static run (req, res, next) {
    let user = {}

    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.GetByEmail(req.body.email))
      .then(userModel => {
        user = userModel
        return authModule.makeResetEmailTokenService(userModel)
      })
      .tap(resetEmailToken => UserDAO.BaseUpdate(user.id, { resetEmailToken }))
      .then(resetEmailToken => {
        return sendEmailService({
          to: user.email,
          subject: '[Supra.com] Password reset instructions',
          text: `Use this token to reset password ${resetEmailToken}`
        })
      })
      .then(data => res.json(this.resJson({ data })))
      .catch(error => next(error))
  }
}

module.exports = SendResetEmailAction
