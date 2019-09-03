const { BaseDAO, assert } = require('supra-core')

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
    assert.integer(userId, { required: true })
    assert.integer(page, { required: true })
    assert.integer(limit, { required: true })
    assert.object(orderBy, { required: true, notEmpty: true })
    assert.string(orderBy.field, { required: true, notEmpty: true })
    assert.string(orderBy.direction, { required: true, notEmpty: true })

    const data = await this.query()
      .where({ userId })
      .page(page, limit)
      .orderBy(orderBy.field, orderBy.direction)
    if (!data.results.length) throw this.errorEmptyResponse()
    return data
  }
}

module.exports = PostDAO
