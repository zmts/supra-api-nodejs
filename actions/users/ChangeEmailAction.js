const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const ErrorWrapper = require('../../core/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

class ChangeEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:change-email'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        email: this.joi.string().email().min(6).max(30).required()
      })
    }
  }

  static async run (req) {
    const { currentUser } = req

    const isExist = await UserDAO.isEmailExist(req.body.email)
    if (isExist) throw new ErrorWrapper({ ...errorCodes.EMAIL_ALREADY_TAKEN })
    await UserDAO.baseUpdate(currentUser.id, { email: req.body.email, isEmailConfirmed: false })

    return this.result({ message: `Email was changed to ${req.body.email}!` })
  }
}

module.exports = ChangeEmailAction
