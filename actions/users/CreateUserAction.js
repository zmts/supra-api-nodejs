const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const { makePasswordHashService, makeEmailConfirmTokenService } = require('../../services/auth')

class CreateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:create'
  }

  static get validationRules () {
    return {
      body: {
        name: [UserModel.schema.name, true],
        username: [UserModel.schema.username, true],
        email: [UserModel.schema.email, true],
        location: [UserModel.schema.location],
        password: [UserModel.schema.passwordHash, true]
      }
    }
  }

  static async run (ctx) {
    const hash = await makePasswordHashService(ctx.body.password)
    delete ctx.body.password
    const user = await UserDAO.create({
      ...ctx.body,
      passwordHash: hash
    })
    const emailConfirmToken = await makeEmailConfirmTokenService(user)
    await UserDAO.baseUpdate(user.id, { emailConfirmToken })

    try {
      await emailClient.send({
        to: user.email,
        subject: 'Welcome to supra.com!',
        text: `Welcome to supra.com! ${user.name} we just created new account for you. Your login: ${user.email}`
      })
    } catch (error) {
      __logger.error(error.message, error)
    }

    return this.result({ data: user })
  }
}

module.exports = CreateUserAction
