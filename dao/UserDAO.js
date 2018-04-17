const BaseDAO = require('./BaseDAO')
const { ref, raw } = require('objection')

class UserDAO extends BaseDAO {
  static get tableName () {
    return 'users'
  }

  static get jsonAttributes () {
    return ['refreshTokensMap']
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */
  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.passwordHash
    delete json.refreshTokensMap
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

  static GetRefreshToken (userId, refreshTokenTimestamp) {
    __typecheck(userId, 'Number', true)
    __typecheck(refreshTokenTimestamp, 'String', true)

    return this.query()
      .findById(userId)
      .select(ref(`refreshTokensMap:${refreshTokenTimestamp}`).castJson().as('refreshToken'))
      .then(data => {
        if (!data.refreshToken) throw this.errorEmptyResponse()
        return data.refreshToken
      }).catch(error => { throw error })
  }

  static RemoveRefreshToken (userId, refreshTokenTimestamp) {
    __typecheck(userId, 'Number', true)
    __typecheck(refreshTokenTimestamp, 'String', true)

    return this.query()
      .patch({ refreshTokensMap: raw('?? - ?', 'refreshTokensMap', refreshTokenTimestamp) })
  }

  static AddRefreshTokenProcess (userId, data) {
    __typecheck(userId, 'Number', true)
    __typecheck(data, 'Object', true)
    __typecheck(data.timestamp, 'String', true)
    __typecheck(data.refreshToken, 'String', true)

    return this._GetRefreshTokensCount(userId)
      .then(count => {
        if (count === 5) { // user can have only 5 sessions(refresh tokens)
          return this._ClearRefreshTokensList(userId)
            .then(() => this._AddRefreshToken(userId, data))
            .catch(error => { throw error })
        }
        return this._AddRefreshToken(userId, data)
      })
  }

  /**
   * add new prop to 'refreshTokensMap' jsonb field
   * prop name === token creation timestamp
   * store to this prop REFRESH TOKEN
   */
  static _AddRefreshToken (userId, data) {
    __typecheck(userId, 'Number', true)
    __typecheck(data, 'Object', true)
    __typecheck(data.timestamp, 'String', true)
    __typecheck(data.refreshToken, 'String', true)

    return this.query()
      .findById(userId)
      .patch({ [`refreshTokensMap:${data.timestamp}`]: data.refreshToken })
  }

  static _GetRefreshTokensCount (userId) {
    __typecheck(userId, 'Number', true)

    return this.query()
      .findById(userId)
      .select('refreshTokensMap')
      .then(data => {
        if (!data) throw this.errorEmptyResponse()
        return Object.keys(data.refreshTokensMap).length
      }).catch(error => { throw error })
  }

  static _ClearRefreshTokensList (userId) {
    __typecheck(userId, 'Number', true)

    return this.query().findById(userId).patch({ refreshTokensMap: {} })
  }
}

module.exports = UserDAO
