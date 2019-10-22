const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const WelcomeEmail = require('../../emails/WelcomeEmail')
const { makePasswordHashHelper, makeEmailConfirmTokenHelper } = require('../../auth')

class CreateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:create'
  }

  static get validationRules () {
    return {
      body: {
        name: new RequestRule(UserModel.schema.name, { required: true }),
        username: new RequestRule(UserModel.schema.username, { required: true }),
        email: new RequestRule(UserModel.schema.email, { required: true }),
        location: new RequestRule(UserModel.schema.location),
        password: new RequestRule(UserModel.schema.passwordHash, { required: true })
      }
    }
  }

  static async run (ctx) {
    const hash = await makePasswordHashHelper(ctx.body.password)
    delete ctx.body.password
    const user = await UserDAO.create({
      ...ctx.body,
      passwordHash: hash
    })

    const emailConfirmToken = await makeEmailConfirmTokenHelper(user)
    await UserDAO.baseUpdate(user.id, { emailConfirmToken })

    try {
      const result = await emailClient.send(new WelcomeEmail({
        to: user.email,
        username: user.username,
        emailConfirmToken
      }))
      __logger.info('Registration email, delivered', { to: user.email, ...result, ctx: this.name })
    } catch (error) {
      if (error.statusCode) { // log mailGun errors
        __logger.error(error.message, error, { ctx: this.name })
      } else {
        throw error
      }
    }

    return this.result({ data: user })
  }
}

module.exports = CreateUserAction
