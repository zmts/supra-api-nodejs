const { assert } = require('supra-core')
const { BaseDAO } = require('./BaseDAO')
const { RefreshSessionDbDto } = require('./dto/RefreshSessionDbDto')

class RefreshSessionDAO extends BaseDAO {
  static get tableName () {
    return 'refresh_sessions'
  }

  static get dto () {
    return RefreshSessionDbDto
  }

  static async getByRefreshToken (refreshToken) {
    assert.string(refreshToken, { notEmpty: true })

    const result = await this.query()
      .where({ refreshToken })
      .first()
    if (!result) throw this.errorEmptyResponse()
    return this.mapObject(result)
  }
}

module.exports = { RefreshSessionDAO }
