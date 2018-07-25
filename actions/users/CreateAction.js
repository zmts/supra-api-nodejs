const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { makePasswordHashService, makeEmailConfirmTokenService } = require('../../services/auth')
const sendEmailService = require('../../services/sendEmailService')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'users:create'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        name: Joi.string().min(3).max(50),
        username: Joi.string().min(3).max(25).required(),
        password: Joi.string().required(), // stores in DB as passwordHash
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static run (req, res, next) {
    let user = {}

    this.init(req, this.validationRules, this.accessTag)
      .then(() => makePasswordHashService(req.body.password))
      .then(hash => {
        delete req.body.password
        req.body['passwordHash'] = hash
        return req.body
      })
      .then(body => UserDAO.BaseCreate(body))
      .then(model => (user = model))
      .then(() => makeEmailConfirmTokenService(user))
      .then(emailConfirmToken => UserDAO.BaseUpdate(user.id, { emailConfirmToken }))
      .then(() => sendEmailService({
        to: user.email,
        subject: 'Welcome to supra.com!',
        text: `Welcome to supra.com! ${user.name} we just created new account for you. Your login: ${user.email}`
      }))
      .then(() => res.json(this.resJson({ data: user })))
      .catch(error => next(error))
  }
}

module.exports = CreateAction
