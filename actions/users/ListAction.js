const joi = require('@hapi/joi')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return users list
 */
class ListAction extends BaseAction {
  static get accessTag () {
    return 'users:list'
  }

  static get validationRules () {
    return {
      query: joi.object().keys({
        ...this.baseQueryParams,
        filter: joi.object().keys({
          username: joi.string().min(3)
        })
      })
    }
  }

  static async run (req) {
    const { query } = req
    const data = await UserDAO.BaseGetList({ ...query })

    return this.result({
      data: data.results,
      headers: {
        'X-Total-Count': data.total
      }
    })
  }
}

module.exports = ListAction
