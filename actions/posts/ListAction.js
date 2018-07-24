const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static get queryProps () {
    return {
      ...this.baseQueryProps
    }
  }

  static run (req, res, next) {
    this.init(req, this.validationRules, this.accessTag)
      .then(() => this.queryResolver(req.query, this.queryProps))
      .then(() => PostDAO.BaseGetList())
      .then(data => res.json(this.resJson({ data })))
      .catch(error => next(error))
  }
}

module.exports = ListAction
