const BaseModel = require('./Base')

class User extends BaseModel {
  static get tableName () {
    return 'users'
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */
  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.password_hash
    delete json.refresh_token
    delete json.reset_token
    delete json.avatar

    return json
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */
}

module.exports = User
