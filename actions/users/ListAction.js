const joi = require('@hapi/joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const Rule = require('../../core/Rule')

/**
 * @description return users list
 */
class ListAction extends BaseAction {
  static get accessTag () {
    return 'users:list'
  }

  static get validationRules () {
    return {
      query: {
        ...this.baseQueryParams,
        orderBy: [new Rule({
          validator: v => joi.validate(v, {
            field: joi.string().valid(['createdAt', 'username']),
            direction: joi.string().valid(['asc', 'desc'])
          }, e => e ? e.message : true),
          description: 'Object; { field: username, direction: asc || desc }'
        })],
        filter: [new Rule({
          validator: v => joi.validate(v, {
            username: joi.string().min(2)
          }, e => e ? e.message : true),
          description: 'String; min 2 chars;'
        })]
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

module.exports = ListAction
