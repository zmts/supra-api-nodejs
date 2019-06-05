const Model = require('objection').Model
// https://github.com/Vincit/objection-db-errors
const { wrapError, UniqueViolationError, NotNullViolationError } = require('db-errors')
const ErrorWrapper = require('../core/ErrorWrapper')
const errorCodes = require('../config/errorCodes')

class BaseDAO extends Model {
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static errorEmptyResponse () {
    return new ErrorWrapper({ ...errorCodes.NOT_FOUND, layer: 'DAO' })
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

  static query () {
    return super.query.apply(this, arguments).onError(error => {
      return Promise.reject(wrapError(error))
        .catch(error => {
          if (error instanceof UniqueViolationError) {
            throw new ErrorWrapper({
              ...errorCodes.DB_DUPLICATE_CONFLICT,
              message: `Column '${error.columns}' duplicate in '${error.table}' table`,
              layer: 'DAO'
            })
          }
          if (error instanceof NotNullViolationError) {
            throw new ErrorWrapper({
              ...errorCodes.DB_NOTNULL_CONFLICT,
              message: `Not null conflict failed for table '${error.table}' and column '${error.column}'`,
              layer: 'DAO'
            })
          }
          throw new ErrorWrapper({ ...errorCodes.DB, message: error.message, layer: 'DAO' })
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

  static baseCreate (entity) {
    __typecheck(entity, __type.object, true)

    /**
     * each entity that creates must to have creator id (userId)
     * except user entity
     */
    if (!entity.email && !entity.userId) {
      throw new ErrorWrapper({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: 'Please provide in action class \'userId\' field',
        layer: 'DAO'
      })
    }

    return this.query().insert(entity)
  };

  static async baseGetList ({ page, limit, filter }) {
    __typecheck(page, __type.number, true)
    __typecheck(limit, __type.number, true)
    __typecheck(filter, __type.object, true)
    __typecheck(filter.userId, __type.number)

    const data = await this.query()
      .where({ ...filter })
      .orderBy('id', 'desc')
      .page(page, limit)
    if (!data.results.length) throw this.errorEmptyResponse()
    return data
  }

  static async baseGetById (id) {
    __typecheck(id, __type.number, true)

    const data = await this.query().findById(id)
    if (!data) throw this.errorEmptyResponse()
    return data
  }

  static baseUpdate (id, entity) {
    __typecheck(id, __type.number, true)
    __typecheck(entity, __type.object, true)

    return this.query().patchAndFetchById(id, entity)
  }

  static baseRemove (id) {
    __typecheck(id, __type.number, true)

    return this.query().deleteById(id)
  }
}

module.exports = BaseDAO
