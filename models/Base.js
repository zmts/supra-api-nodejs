const Model = require('objection').Model
const ErrorWrapper = require('../util/Error')

class BaseModel extends Model {

  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static error (message = global.required(), status = global.required()) {
    return new ErrorWrapper(message, status)
  }

  static errorEmptyResponse () {
    return new ErrorWrapper('Empty response', 404)
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

  static CREATE (data = global.required()) {
    return this.query().insert(data)
  };

  static GETall () {
    return this.query().orderBy('id', 'desc')
      .then(function (data) {
        if (!data.length) throw this.errorEmptyResponse
        return data
      }).catch(error => { throw error })
  }

  static GETbyId (id = global.required()) {
    return this.query().findById(id)
      .then(data => {
        if (!data) throw this.errorEmptyResponse
        return data
      }).catch(error => { throw error })
  }

  static UPDATE (id = global.required(), data = global.required()) {
    return this.query().patchAndFetchById(id, data)
  }

  static REMOVE (id = global.required()) {
    return this.query().deleteById(id)
  }

}

module.exports = BaseModel
