const { BaseDAO, assert } = require('supra-core')
const { UserModel } = require('../models/UserModel')

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
        modelClass: `${__dirname}/PostDAO`,
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

    // delete sensitive data from all queries
    delete json.passwordHash
    delete json.emailConfirmToken
    delete json.resetPasswordToken
    delete json.newEmail
    delete json.email

    return json
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static create (data) {
    assert.object(data, { required: true })
    assert.string(data.passwordHash, { notEmpty: true })

    return this.query().insert(data)
  };

  static async getByEmail (email) {
    assert.validate(email, UserModel.schema.email, { required: true })

    const data = await this.query().where({ email }).first()
    if (!data) throw this.errorEmptyResponse()
    return data
  }

  static async getCurrentUser (id) {
    assert.validate(id, UserModel.schema.id, { required: true })

    const data = await this.knexQuery().from(this.tableName).where({ id }).first()
    if (!data) throw this.errorEmptyResponse()

    // delete sensitive data from current user
    delete data.passwordHash
    delete data.emailConfirmToken
    delete data.resetPasswordToken

    return data
  }

  /**
   * @description check email availability in DB.
   * @param email
   * @returns {Promise<boolean>}
   */
  static async isEmailExist (email) {
    assert.validate(email, UserModel.schema.email, { required: true })

    const data = await this.query().where({ email }).first()
    return Boolean(data)
  }

  static async checkEmailAvailability (email) {
    assert.validate(email, UserModel.schema.email, { required: true })

    const data = await this.query().where({ email }).first()
    return { available: !data }
  }
}

module.exports = { UserDAO }
