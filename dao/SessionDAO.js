const { BaseDAO, assert } = require('supra-core')

class SessionDAO extends BaseDAO {
  static get tableName () {
    return 'sessions'
  }

  static async getByRefreshToken (refreshToken) {
    assert.string(refreshToken, { notEmpty: true })

    const result = await this.query()
      .where({ refreshToken })
      .first()
    if (!result) throw this.errorEmptyResponse()
    return result
  }
}

module.exports = SessionDAO
