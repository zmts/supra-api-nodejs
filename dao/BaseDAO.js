const Model = require('objection').Model
// https://github.com/Vincit/objection-db-errors
const { wrapError, UniqueViolationError, NotNullViolationError } = require('db-errors')
const ErrorWrapper = require('../util/ErrorWrapper')
const errorCodes = require('../config/errorCodes')
const registry = require('../registry')

class BaseDAO extends Model {

  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static errorWrapper (options = {}) { // {message: '', status: 500, code: ''}
    __typecheck(options.message, 'String', true)

    return new ErrorWrapper(options)
  }

  static errorEmptyResponse () {
    return new ErrorWrapper({ ...errorCodes.NOT_FOUND })
  }

  static query () {
    return super.query.apply(this, arguments).onError(error => {
      return Promise.reject(wrapError(error))
        .catch(error => {
          if (error instanceof UniqueViolationError) {
            throw this.errorWrapper({
              ...errorCodes.DB_DUPLICATE_CONFLICT,
              // message: `Unique constraint '${error.constraint}' failed for table '${error.table}' and columns '${error.columns}'`
              message: `Column '${error.columns}' duplicate in '${error.table}' table`
            })
          }
          if (error instanceof NotNullViolationError) {
            throw this.errorWrapper({
              ...errorCodes.DB,
              message: `Not null constraint failed for table '${error.table}' and column '${error.column}'`
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
    __typecheck(data, 'Object', true)

    return this.query().insert(data)
  };

  static BaseGetList () {
    let pageNumber = registry.queryParams.get().page
    let limit = registry.queryParams.get().limit

    return this.query()
      .orderBy('id', 'desc')
      .page(pageNumber, limit)
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
