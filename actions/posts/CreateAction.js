const Joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const NewPostModel = require('../../models/post/NewPostModel')
const registry = require('../../registry')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'posts:create'
  }

  static get validationRules () {
    return {
      body: Joi.object().keys({
        ...this.clearModelSchema(NewPostModel.schema)
      })
    }
  }

  static async run (req, res) {
    const currentUser = registry.currentUser.get()
    const data = await PostDAO.BaseCreate(new NewPostModel({ ...req.body, userId: currentUser.id }))
    res.json(this.resJson({ data }))
  }
}

module.exports = CreateAction
