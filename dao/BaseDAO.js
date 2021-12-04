const Model = require('objection').Model
// https://github.com/Vincit/objection-db-errors
const { wrapError, UniqueViolationError, NotNullViolationError } = require('db-errors')
const { assert, errorCodes, AppError } = require('supra-core')

class BaseDAO extends Model {
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static errorEmptyResponse () {
    return new AppError({ ...errorCodes.NOT_FOUND, layer: 'DAO' })
  }

  static emptyPageResponse () {
    return { results: [], total: 0 }
  }

  static emptyListResponse () {
    return []
  }

  static emptyObjectResponse () {
    return {}
  }

  static get dto () {
    return new AppError({
      ...errorCodes.SERVER,
      layer: 'DAO',
      message: `${this.name}: missing dto getter`
    })
  }

  /**
   * @param data
   * @returns {{total, results: *[]}}
   */
  static mapPage (data = {}) {
    assert.array(data.results, { required: true })
    assert.integer(data.total, { required: true })

    const Dto = this.dto
    assert.func(Dto, { required: true })

    return {
      results: data.results.map(i => new Dto(i)),
      total: data.total || 0
    }
  }

  /**
   * @param data
   * @returns {*}
   */
  static mapObject (data = {}) {
    assert.object(data, { required: true })

    const Dto = this.dto
    assert.func(Dto, { required: true })

    return new Dto(data)
  }

  static verifyUserId (data) {
    assert.object(data, { required: true })

    /**
     * each entity that creates must have creator id (userId)
     */
    if (!data.email && !data.userId) {
      throw new AppError({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: 'Please provide in action class \'userId\' field',
        layer: 'DAO'
      })
    }
  }

  static query () {
    return super.query.apply(this, arguments).onError(error => {
      return Promise.reject(wrapError(error))
        .catch(error => {
          error = error.nativeError || error

          if (error instanceof UniqueViolationError) {
            throw new AppError({
              ...errorCodes.DB_DUPLICATE_CONFLICT,
              message: `Column '${error.columns}' duplicate in '${error.table}' table`,
              layer: 'DAO'
            })
          }

          if (error instanceof NotNullViolationError) {
            throw new AppError({
              ...errorCodes.DB_NOTNULL_CONFLICT,
              message: `Not null conflict failed for table '${error.table}' and column '${error.column}'`,
              layer: 'DAO'
            })
          }

          throw new AppError({ ...errorCodes.DB, message: error.message, layer: 'DAO' })
        })
    })
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static async baseCreate (data = {}) {
    assert.object(data, { required: true })
    this.verifyUserId(data)

    const result = await this.query().insert(data)

    return this.mapObject(result)
  }

  static async baseUpdate (id, data = {}) {
    assert.id(id, { required: true })
    assert.object(data, { required: true })

    const result = await this.query().patchAndFetchById(id, data)

    return this.mapObject(result)
  }

  static async baseGetList ({ page, limit, filter, orderBy } = {}) {
    assert.integer(page, { required: true })
    assert.integer(limit, { required: true })
    assert.object(filter, { required: true })
    assert.id(filter.userId)

    const data = await this.query()
      .where({ ...filter })
      .orderBy(orderBy.field, orderBy.direction)
      .page(page, limit)

    if (!data.results.length) return this.emptyPageResponse()
    return this.mapPage(data)
  }

  static async baseGetCount (filter = {}) {
    assert.object(filter, { required: true })

    const result = await this.query()
      .where({ ...filter })
      .count('*')
      .first()
    if (!result.count) return 0
    return Number(result.count)
  }

  static async baseGetById (id) {
    assert.id(id, { required: true })

    const data = await this.query().findById(id)
    if (!data) throw this.errorEmptyResponse()

    return this.mapObject(data)
  }

  static baseRemove (id) {
    assert.id(id, { required: true })

    return this.query().deleteById(id)
  }

  static baseRemoveWhere (where = {}) {
    assert.object(where, { required: true })

    return this.query().delete().where({ ...where })
  }
}

module.exports = { BaseDAO }
