const joi = require('@hapi/joi')
const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get validationRules () {
    return {
      query: joi.object().keys({
        ...this.baseQueryParams,
        filter: joi.object().keys({
          userId: joi.number().integer().min(1)
        })
      })
    }
  }

  static async run (req) {
    const { query } = req
    const data = await PostDAO.BaseGetList({ ...query })

    return this.result({
      data: data.results,
      headers: { 'X-Total-Count': data.total }
    })
  }
}

module.exports = ListAction
