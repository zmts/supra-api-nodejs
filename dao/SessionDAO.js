const BaseDAO = require('../core/BaseDAO')

class SessionDAO extends BaseDAO {
  static get tableName () {
    return 'sessions'
  }

  static async getByRefreshToken (refreshToken) {
    __typecheck(refreshToken, __type.string, true)

    const result = await this.query()
      .where({ refreshToken })
      .first()
    if (!result) throw this.errorEmptyResponse()
    return result
  }
}

module.exports = SessionDAO
