const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'posts:get-by-id'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => this.checkAccessByTag(this.accessTag))
      .then(() => PostDAO.GET_BY_ID(+req.params.id))
      .then(model => this.checkAccessToPrivateItem(model))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = GetByIdAction
