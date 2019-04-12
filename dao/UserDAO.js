const { raw } = require('objection')

const BaseDAO = require('../core/BaseDAO')
const PostDAO = require('./PostDAO')
// const errorCodes = require('../config/errorCodes')

class UserDAO extends BaseDAO {
  static get tableName () {
    return 'users'
  }

  static get jsonAttributes () {
    return ['refreshTokensMap']
  }

  static get relationMappings () {
    return {
      posts: {
        relation: BaseDAO.HasManyRelation,
        modelClass: PostDAO,
        join: {
          from: 'users.id',
          to: 'posts.userId'
        }
      }
    }
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */
  $formatJson (json) {
    json = super.$formatJson(json)

    delete json.passwordHash
    // delete json.refreshTokensMap
    delete json.tokenReset
    delete json.avatar

    return json
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static Create (data) {
    __typecheck(data, __type.object, true)
    __typecheck(data.passwordHash, __type.string, true, 'Invalid \'passwordHash\' field')

    return this.query().insert(data)
  };

  static GetByEmail (email) {
    __typecheck(email, __type.string, true)

    return this.query().where({ email }).first()
      .then(data => {
        if (!data) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  /**
   * @description check email availability in DB.
   * @param email
   * @returns {Promise<boolean>}
   */
  static IsEmailExist (email) {
    __typecheck(email, __type.string, true)

    return this.query().where({ email }).first()
      .then(data => Boolean(data))
      .catch(error => { throw error })
  }

  static RemoveRefreshToken (userId, refreshTokenTimestamp) {
    __typecheck(userId, __type.number, true)
    __typecheck(refreshTokenTimestamp, __type.string, true)

    return this.query()
      .patch({ refreshTokensMap: raw('?? - ?', 'refreshTokensMap', refreshTokenTimestamp) })
  }

  static AddRefreshTokenProcess (userEntity, data) {
    __typecheck(userEntity, __type.object, true)
    __typecheck(data, __type.object, true)
    __typecheck(data.timestamp, __type.string, true)
    __typecheck(data.refreshToken, __type.string, true)

    if (this._isValidRefreshTokensCount(userEntity)) {
      return this._addRefreshToken(userEntity.id, data)
    }
    return this._clearRefreshTokensList(userEntity.id)
      .then(() => this._addRefreshToken(userEntity.id, data))
      .catch(error => { throw error })
  }

  /**
   * add new prop to 'refreshTokensMap' jsonb field
   * prop name === token creation timestamp
   * store to this prop REFRESH TOKEN
   */
  static _addRefreshToken (userId, data) {
    __typecheck(userId, __type.number, true)
    __typecheck(data, 'Object', true)
    __typecheck(data.timestamp, 'String', true)
    __typecheck(data.refreshToken, 'String', true)

    return this.query()
      .findById(userId)
      .patch({ [`refreshTokensMap:${data.timestamp}`]: data.refreshToken })
  }

  static _clearRefreshTokensList (userId) {
    __typecheck(userId, __type.number, true)

    return this.query().findById(userId).patch({ refreshTokensMap: {} })
  }

  /**
   * user can have max 5 sessions(refresh tokens)
   */
  static _isValidRefreshTokensCount (userEntity) {
    __typecheck(userEntity, __type.object, true)

    let count = Object.keys(userEntity.refreshTokensMap).length
    return count <= 5
  }
}

module.exports = UserDAO
