const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get validationRules () {
    return {
      query: this.joi.object().keys({
        ...this.baseQueryParams,
        filter: this.joi.object().keys({
          userId: this.joi.number().integer().min(1)
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
