const { assert } = require('supra-core')
const { UserModel } = require('../models/UserModel')
const { UserDbDto } = require('./dto/UserDbDto')
const { BaseDAO } = require('./BaseDAO')

class UserDAO extends BaseDAO {
  static get tableName () {
    return 'users'
  }

  static get dto () {
    return UserDbDto
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
    return json
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static async create (data) {
    assert.object(data, { required: true })
    assert.string(data.passwordHash, { notEmpty: true })

    const result = await this.query().insert(data)

    return this.mapObject(result)
  };

  static async getByEmail (email) {
    assert.validate(email, UserModel.schema.email, { required: true })

    const data = await this.query().where({ email }).first()
    if (!data) throw this.errorEmptyResponse()
    return this.mapObject(data)
  }

  static async getCurrentUser (id) {
    assert.validate(id, UserModel.schema.id, { required: true })

    const data = await this.query().findById(id)
    if (!data) throw this.errorEmptyResponse()

    // delete sensitive data from raw current user
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
