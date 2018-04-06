const Model = require('objection').Model
const ErrorWrapper = require('../util/Error')

class BaseDAO extends Model {

  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static errorWrapper (message, status) {
    __typecheck(message, 'String', true)
    __typecheck(status, 'Number', true)

    return new ErrorWrapper(message, status)
  }

  static errorEmptyResponse () {
    return new ErrorWrapper('Empty response, not found', 404)
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */

  $beforeUpdate () {
    this.updated_at = new Date().toISOString()
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static CREATE (data) {
    __typecheck(data, 'Object', true)

    return this.query().insert(data)
  };

  static GETList () {
    return this.query().orderBy('id', 'desc')
      .then(data => {
        if (!data.length) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  static GETbyId (id) {
    __typecheck(id, 'Number', true)

    return this.query().findById(id)
      .then(data => {
        if (!data) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  static UPDATE (id, data) {
    __typecheck(id, 'Number', true)
    __typecheck(data, 'Object', true)

    return this.query().patchAndFetchById(id, data)
  }

  static REMOVE (id) {
    __typecheck(id, 'Number', true)

    return this.query().deleteById(id)
  }

}

module.exports = BaseDAO
