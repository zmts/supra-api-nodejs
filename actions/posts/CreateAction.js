const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'posts:create'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        title: this.joi.string().min(3).max(20).required(),
        content: this.joi.string().min(3).max(5000)
      })
    }
  }

  static async run (req) {
    const { currentUser } = req
    const data = await PostDAO.baseCreate({ ...req.body, userId: currentUser.id })

    return this.result({ data })
  }
}

module.exports = CreateAction
