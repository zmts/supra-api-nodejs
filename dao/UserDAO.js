const BaseDAO = require('./BaseDAO')
const { ref, raw } = require('objection')

class UserDAO extends BaseDAO {
  static get tableName () {
    return 'users'
  }

  static get jsonAttributes () {
    return ['tokenRefresh']
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */
  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.passwordHash
    delete json.tokenRefresh
    delete json.tokenReset
    delete json.avatar

    return json
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static GetByEmail (email) {
    __typecheck(email, 'String', true)

    return this.query().where({ email }).first()
      .then(data => {
        if (!data) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  static GetRefreshTokenByUserId (userId, refreshTokenIv) {
    __typecheck(userId, 'Number', true)
    __typecheck(refreshTokenIv, 'String', true)

    return this.query()
      .findById(userId)
      .select(ref(`${this.tableName}.tokenRefresh:${refreshTokenIv}`)
      .castText()
      .as('refreshToken'))
      .first()
      .then(data => {
        if (!data.refreshToken) throw this.errorEmptyResponse()
        return data.refreshToken
      }).catch(error => { throw error })
  }
  /**
   * add new prop to 'tokenRefresh' jsonb field
   * prop name === Initialization Vector (taken from REFRESH TOKEN body)
   * store to this prop REFRESH TOKEN
   */
  static AddRefreshToken (userId, data) {
    __typecheck(userId, 'Number', true)
    __typecheck(data, 'Object', true)
    __typecheck(data.iv, 'String', true)
    __typecheck(data.refreshToken, 'String', true)

    return this.query()
      .findById(userId)
      .patch({ [`tokenRefresh:${data.iv}`]: data.refreshToken })
  }

  static RemoveRefreshToken (userId, refreshTokenIv) {
    __typecheck(userId, 'Number', true)
    __typecheck(refreshTokenIv, 'String', true)

    return this.query()
      .patch({ tokenRefresh: raw('?? - ?', 'tokenRefresh', refreshTokenIv) })
  }

  static ClearRefreshTokensListByUserId (id) {
    __typecheck(id, 'Number', true)

    return this.query().findById(id).patch({})
  }
}

module.exports = UserDAO
