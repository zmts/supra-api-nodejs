const Wetland = require('wetland').Wetland
const EntityRepository = require('wetland').EntityRepository

const config = require('../wetland')
const ErrorWrapper = require('../util/Error')

class BaseRepository extends EntityRepository {
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */
  static get MANAGER () {
    return new Wetland(config).getManager()
  }

  static SET_DATA (data, entity) {
    if (!data) throw new ErrorWrapper('requires data param', 500)
    if (!entity) throw new ErrorWrapper('requires entity param', 500)

    return Object.keys(data).forEach(key => {
      entity[key] = data[key]
    })
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */
  static CREATE (data) {
    if (!data) throw new ErrorWrapper('requires data param', 500)
    if (!this.Entity) throw new ErrorWrapper('requires Entity param', 500)

    let entity = new this.Entity()
    this.SET_DATA(data, entity)

    return this.MANAGER.persist(entity).flush()
      .then(() => entity)
      .catch(error => { throw new Error(error) })
  }

  static UPDATE (id, date) {
    if (!id) throw new ErrorWrapper('requires id param', 500)
    //
  }

  static REMOVE (id) {
    if (!id) throw new ErrorWrapper('requires id param', 500)
    //
  }

  static GETById (id) {
    if (!id) throw new ErrorWrapper('requires id param', 500)

    return this.MANAGER.getRepository(this.Entity).findOne({ id })
      .then(model => {
        if (model) return model
        return new ErrorWrapper('Empty response', 404)
      }).catch(error => { throw new ErrorWrapper(error, 500) })
  }

  static GETall () {
    return this.MANAGER.getRepository(this.Entity).find()
      .then(model => {
        if (model) return model
        return new ErrorWrapper('Empty response', 404)
      }).catch(error => { throw new ErrorWrapper(error, 500) })
  }
}

module.exports = BaseRepository

