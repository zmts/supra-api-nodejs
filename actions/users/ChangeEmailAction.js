const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const registry = require('../../registry')
const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

class ChangeEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:change-email'
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
    let currentUser = registry.currentUser.get()

    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.IsEmailExist(req.body.email))
      .then(isExist => {
        if (!isExist) {
          return UserDAO.BaseUpdate(currentUser.id, { email: req.body.email, isEmailConfirmed: false })
        }
        throw new ErrorWrapper({ ...errorCodes.EMAIL_ALREADY_TAKEN })
      })
      .then(() => res.json(this.resJson({ message: `Email was changed to ${req.body.email}!` })))
      .catch(error => next(error))
  }
}

module.exports = ChangeEmailAction
