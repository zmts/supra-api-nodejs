const BaseAction = require('../base')

/**
 * @description create user entity
 */
class Create extends BaseAction {
  run (req, res, next) {
    res.json({ data: 'create user' })
  }
}

module.exports = Create
