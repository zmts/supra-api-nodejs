const BaseDAO = require('../core/BaseDAO')

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

  static async getPostsByUserId (userId, { page, limit, orderBy } = {}) {
    __typecheck(userId, __type.number, true)
    __typecheck(page, __type.number, true)
    __typecheck(limit, __type.number, true)
    __typecheck(orderBy, __type.object, true)
    __typecheck(orderBy.field, __type.string, true)
    __typecheck(orderBy.direction, __type.string, true)

    const data = await this.query()
      .where({ userId })
      .page(page, limit)
      .orderBy(orderBy.field, orderBy.direction)
    if (!data.results.length) throw this.errorEmptyResponse()
    return data
  }
}

module.exports = PostDAO
