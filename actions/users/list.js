const BaseAction = require('../base')

/**
 * @description return users list
 */
class List extends BaseAction {
  name () {
    return 'users-list'
  }

  permissions () {
    return {
      anonymous: false,
      admin: true,
      editor: true
    }
  }

  validationRules () {
    return {
      ...this.baseValidationRules(),
      someValidationRule: 'lol'
    }
  }

  execute (req, res, next) {
    this.validate(this.validationRules())
    res.json({ data: 'users list' })
  }
}

module.exports = List
