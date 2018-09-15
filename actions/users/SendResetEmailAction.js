const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const authModule = require('../../services/auth')
const sendEmailService = require('../../services/sendEmailService')

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
      body: Joi.object().keys({
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static async run (req, res) {
    const user = await UserDAO.GetByEmail(req.body.email)
    const resetEmailToken = await authModule.makeResetEmailTokenService(user)
    await UserDAO.BaseUpdate(user.id, { resetEmailToken })
    const response = await sendEmailService({
      to: user.email,
      subject: '[Supra.com] Password reset instructions',
      text: `Use this token to reset password ${resetEmailToken}`
    })
    res.json(this.resJson({ data: response }))
  }
}

module.exports = SendResetEmailAction
