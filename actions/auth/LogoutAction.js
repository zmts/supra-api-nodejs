const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const SessionDAO = require('../../dao/SessionDAO')
const AuthModel = require('../../models/AuthModel')

/**
 * remove current session
 */
class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static get validationRules () {
    return {
      body: {
        refreshToken: new RequestRule(AuthModel.schema.refreshToken, true)
      }
    }
  }

  static async run (ctx) {
    await SessionDAO.baseRemoveWhere({ refreshToken: ctx.body.refreshToken })

    return this.result({ message: 'User is logged out from current session.' })
  }
}

module.exports = LogoutAction
