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

  static GetPostsByUserId (userId, { page, limit, orderBy }) {
    __typecheck(userId, 'Number', true)
    __typecheck(page, __type.number, true)
    __typecheck(limit, __type.number, true)
    __typecheck(orderBy, __type.object, true)
    __typecheck(orderBy.field, __type.string, true)
    __typecheck(orderBy.direction, __type.string, true)

    return this.query()
      .where({ userId })
      .page(page, limit)
      .orderBy(orderBy.field, orderBy.direction)
      .then(data => {
        if (!data.results.length) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }
}

module.exports = PostDAO
