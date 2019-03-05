const Joi = require('joi')

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
      body: Joi.object().keys({
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static async run (req, res) {
    const { currentUser } = req

    const isExist = await UserDAO.IsEmailExist(req.body.email)
    if (isExist) throw new ErrorWrapper({ ...errorCodes.EMAIL_ALREADY_TAKEN })
    await UserDAO.BaseUpdate(currentUser.id, { email: req.body.email, isEmailConfirmed: false })
    res.json(this.resJson({ message: `Email was changed to ${req.body.email}!` }))
  }
}

module.exports = ChangeEmailAction
