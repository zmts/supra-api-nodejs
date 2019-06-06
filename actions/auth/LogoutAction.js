const BaseAction = require('../BaseAction')
const SessionDAO = require('../../dao/SessionDAO')

class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        refreshToken: this.joi.string().required()
      })
    }
  }

  static async run (ctx) {
    await SessionDAO.baseRemoveWhere({ refreshToken: ctx.body.refreshToken })

    return this.result({ message: 'User is logged out from current session.' })
  }
}

module.exports = LogoutAction
