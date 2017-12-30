const BaseAction = require('../base')

/**
 * @description create user entity
 */
class Create extends BaseAction {
  execute (req, res, next) {
    res.json({ data: 'create user' })
  }
}

module.exports = Create
