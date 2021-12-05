const joi = require('joi')
const { RequestRule, Rule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')

/**
 * @description return users list
 */
class ListUsersAction extends BaseAction {
  static get accessTag () {
    return 'users:list'
  }

  static get validationRules () {
    return {
      query: {
        ...this.baseQueryParams,
        orderBy: new RequestRule(new Rule({
          validator: v => {
            const result = joi.object({
              field: joi.string().valid('createdAt', 'username'),
              direction: joi.string().valid('asc', 'desc')
            }).validate(v)
            return result.error && result.error.message || true
          },
          description: 'Object; { field: \'username\' || \'createdAt\', direction: \'asc\' || \'desc\' }',
          example: 'orderBy[direction]=desc&orderBy[field]=username'
        })),
        filter: new RequestRule(new Rule({
          validator: v => {
            const result = joi.object({
              username: joi.string().min(2)
            }).validate(v)
            return result.error && result.error.message || true
          },
          description: 'Object; { username: string; String; min 2 chars',
          example: 'filter[username]=alex'
        }))
      }
    }
  }

  static async run (req) {
    const { query } = req
    const data = await UserDAO.baseGetList({ ...query })

    return this.result({
      data: data.results,
      headers: {
        'X-Total-Count': data.total
      }
    })
  }
}

module.exports = { ListUsersAction }
