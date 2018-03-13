const Model = require('objection').Model
const ErrorWrapper = require('../util/Error')

class BaseModel extends Model {

  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static errorWrapper (message = global.required('message'), status = global.required('status')) {
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

  static CREATE (data = global.required('data')) {
    return this.query().insert(data)
  };

  static GETList () {
    return this.query().orderBy('id', 'desc')
      .then(data => {
        if (!data.length) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  static GETbyId (id = global.required('id')) {
    return this.query().findById(id)
      .then(data => {
        if (!data) throw this.errorEmptyResponse()
        return data
      }).catch(error => { throw error })
  }

  static UPDATE (id = global.required('id'), data = global.required('data')) {
    return this.query().patchAndFetchById(id, data)
  }

  static REMOVE (id = global.required('id')) {
    return this.query().deleteById(id)
  }

}

module.exports = BaseModel
