// const Joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
// const authModule = require('../../services/auth')

class GetPostsByUserIdAction extends BaseAction {
  static get accessTag () {
    return 'user:get-posts-by-user-id'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static get queryProps () {
    return {
      ...this.baseQueryProps,
      filter: {
        // todo
      }
    }
  }

  static run (req, res, next) {
    this.init(req, this.validationRules, this.accessTag)
      .then(() => this.queryResolver(req.query, this.queryProps))
      .then(() => PostDAO.GetPostsByUserId(+req.params.id))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = GetPostsByUserIdAction
