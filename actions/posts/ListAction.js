const joi = require('joi')
const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get validationRules () {
    return {
      query: joi.object().keys({
        ...this.baseValidationRules.query,
        filter: joi.object().keys({
          userId: joi.number().integer().min(1)
        })
      })
    }
  }

  static async run (req, res) {
    const { query } = req
    const data = await PostDAO.BaseGetList({ ...query })
    res.header('X-Total-Count', data.total)
    res.json(this.resJson({ data: data.results }))
  }
}

module.exports = ListAction
