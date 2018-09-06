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

  static async run (req, res, next) {
    try {
      await this.init(req, this.validationRules, this.accessTag)
      const hash = await makePasswordHashService(req.body.password)
      delete req.body.password
      req.body['passwordHash'] = hash
      const user = await UserDAO.BaseCreate(req.body)
      const emailConfirmToken = await makeEmailConfirmTokenService(user)
      await UserDAO.BaseUpdate(user.id, { emailConfirmToken })
      res.json(this.resJson({ data: user }))
      try {
        const emailSendSuccess = await sendEmailService({
          to: user.email,
          subject: 'Welcome to supra.com!',
          text: `Welcome to supra.com! ${user.name} we just created new account for you. Your login: ${user.email}`
        })
        __logger(emailSendSuccess)
      } catch (error) { next(error) }
    } catch (error) { next(error) }
  }
}

module.exports = CreateAction
