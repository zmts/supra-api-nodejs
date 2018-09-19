const joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'posts:update'
  }

  static get validationRules () {
    return {
      body: joi.object().keys({
        title: joi.string().min(3).max(20),
        content: joi.string().min(3).max(5000)
      })
    }
  }

  static async run (req, res) {
    const { currentUser } = req

    const model = await PostDAO.BaseGetById(+req.params.id)
    await this.checkAccessByOwnerId(model, currentUser)
    const data = await PostDAO.BaseUpdate(+req.params.id, req.body)

    res.json(this.resJson({ data }))
  }
}

module.exports = UpdateAction
