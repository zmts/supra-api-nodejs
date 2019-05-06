const joi = require('joi')

const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const { makePasswordHashService, makeEmailConfirmTokenService } = require('../../services/auth')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'users:create'
  }

  static get validationRules () {
    return {
      body: joi.object().keys({
        name: joi.string().min(3).max(50).required(),
        username: joi.string().min(3).max(25).required(),
        email: joi.string().email().min(6).max(30).required(),
        password: joi.string().required()
      })
    }
  }

  static async run (req, res) {
    const hash = await makePasswordHashService(req.body.password)
    delete req.body.password
    const user = await UserDAO.Create({
      ...req.body,
      passwordHash: hash
    })
    const emailConfirmToken = await makeEmailConfirmTokenService(user)
    await UserDAO.BaseUpdate(user.id, { emailConfirmToken })

    try {
      await emailClient.send({
        to: user.email,
        subject: 'Welcome to supra.com!',
        text: `Welcome to supra.com! ${user.name} we just created new account for you. Your login: ${user.email}`
      })
    } catch (error) {
      __logger.error(error.message, error)
    }

    res.json(this.resJson({ data: user }))
  }
}

module.exports = CreateAction
