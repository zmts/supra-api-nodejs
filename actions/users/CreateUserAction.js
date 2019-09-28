const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
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
