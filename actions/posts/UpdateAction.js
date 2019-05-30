const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const { checkAccessByOwnerIdService } = require('../../services/security')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'posts:update'
  }

  static get validationRules () {
    return {
      params: this.joi.object().keys({
        id: this.joi.number().integer().positive().required()
      }),
      body: this.joi.object().keys({
        title: this.joi.string().min(3).max(20),
        content: this.joi.string().min(3).max(5000)
      })
    }
  }

  static async run (req) {
    const { currentUser } = req

    const model = await PostDAO.BaseGetById(+req.params.id)
    await checkAccessByOwnerIdService(model, currentUser)
    const data = await PostDAO.BaseUpdate(+req.params.id, req.body)

    return this.result({ data })
  }
}

module.exports = UpdateAction
