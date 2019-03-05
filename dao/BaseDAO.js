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

  static errorWrapper (options = {}) {
    __typecheck(options.message, 'String', true)

    return new ErrorWrapper(options)
  }

  static errorEmptyResponse () {
    return new ErrorWrapper({ ...errorCodes.NOT_FOUND })
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
            throw this.errorWrapper({
              ...errorCodes.DB_DUPLICATE_CONFLICT,
              message: `Column '${error.columns}' duplicate in '${error.table}' table`
            })
          }
          if (error instanceof NotNullViolationError) {
            throw this.errorWrapper({
              ...errorCodes.DB_NOTNULL_CONFLICT,
              message: `Not null conflict failed for table '${error.table}' and column '${error.column}'`
            })
          }
          throw this.errorWrapper({ ...errorCodes.DB, message: error.message })
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

  static BaseCreate (data) {
    __typecheck(data, __type.object, true)

    /**
     * each entity that creates must to have creator id (userId)
     * except user entity
     */
    if (!data.email && !data.userId) {
      throw this.errorWrapper({
        ...errorCodes.UNPROCESSABLE_ENTITY,
        message: 'Please provide in action class \'userId\' field'
      })
    }

    return this.query().insert(data)
  };

  static BaseGetList ({ page, limit, filter }) {
    __typecheck(page, __type.number, true)
    __typecheck(limit, __type.number, true)
    __typecheck(filter, __type.object, true)
    __typecheck(filter.userId, __type.number)

    return this.query()
      .where({ ...filter })
      .orderBy('id', 'desc')
      .page(page, limit)
      .then(data => {
        if (!data.results.length) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  static BaseGetById (id) {
    __typecheck(id, 'Number', true)

    return this.query().findById(id)
      .then(data => {
        if (!data) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  static BaseUpdate (id, data) {
    __typecheck(id, 'Number', true)
    __typecheck(data, 'Object', true)

    return this.query().patchAndFetchById(id, data)
  }

  static BaseRemove (id) {
    __typecheck(id, 'Number', true)

    return this.query().deleteById(id)
  }

}

module.exports = BaseDAO
