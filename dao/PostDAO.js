const BaseDAO = require('./BaseDAO')
const registry = require('../registry')

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

  static GetPostsByUserId (userId) {
    __typecheck(userId, 'Number', true)

    return this.query()
      .where({ userId })
      .page(registry.queryParams.get().page, registry.queryParams.get().limit)
      .orderBy(registry.queryParams.get().orderBy.field, registry.queryParams.get().orderBy.direction)
      .then(data => {
        if (!data.results.length) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }
}

module.exports = PostDAO
