const BaseDAO = require('./BaseDAO')

class PostDAO extends BaseDAO {
  static get tableName () {
    return 'posts'
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */
  $formatJson (json) {
    json = super.$formatJson(json)
    return json
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */
}

module.exports = PostDAO
