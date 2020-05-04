const isUUID = require('validator/lib/isUUID')
const { RequestRule, Rule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { PostDAO } = require('../../../dao/PostDAO')

class ListPostsAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get validationRules () {
    return {
      query: {
        ...this.baseQueryParams,
        filter: new RequestRule(new Rule({
          validator: v => {
            if (v && v.userId) { return isUUID(v.userId) }
            return true
          },
          description: 'filter.userId: uuid;',
          example: 'filter[userId]=5e33250c-ce15-4bec-a623-8611573d5b82'
        }))
      }
    }
  }

  static async run (ctx) {
    const { query } = ctx
    const data = await PostDAO.baseGetList({ ...query })

    return this.result({
      data: data.results,
      headers: { 'X-Total-Count': data.total }
    })
  }
}

module.exports = { ListPostsAction }
