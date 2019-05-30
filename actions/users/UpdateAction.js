const Joi = require('@hapi/joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'users:update'
  }

  static get validationRules () {
    return {
      body: Joi.object().keys({
        name: Joi.string().min(3).max(50)
      })
    }
  }

  static async run (req) {
    const { currentUser } = req
    const data = await UserDAO.BaseUpdate(currentUser.id, req.body) // user can update only itself

    return this.result({ data })
  }
}

module.exports = UpdateAction
