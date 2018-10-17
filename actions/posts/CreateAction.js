const joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'posts:create'
  }

  static get validationRules () {
    return {
      body: joi.object().keys({ // TODO replace joi.object with plain object
        title: joi.string().min(3).max(20).required(),
        content: joi.string().min(3).max(5000)
      })
    }
  }

  static async run (req, res) {
    const { currentUser } = req
    const data = await PostDAO.BaseCreate({ ...req.body, userId: currentUser.id })
    res.json(this.resJson({ data }))
  }
}

module.exports = CreateAction
