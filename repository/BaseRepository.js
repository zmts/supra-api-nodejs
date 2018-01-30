const EntityRepository = require('wetland').EntityRepository
const ErrorWrapper = require('../util/Error')
const wetlandManagerInstance = require('../wetlandManagerInstance')

class BaseRepository extends EntityRepository {
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */
  static get MANAGER () {
    return wetlandManagerInstance
  }

  static SET_DATA (entity, data) {
    if (!entity) throw new ErrorWrapper('requires entity param', 500)
    if (!data) throw new ErrorWrapper('requires data param', 500)

    Object.keys(data).forEach(key => {
      entity[key] = data[key]
    })
  }

  static GET_TOTAL (whereParams) {
    const where = whereParams || {}
    return this.MANAGER
      .getRepository(this.Entity)
      .getQueryBuilder()
      .select({ count: '*' })
      .where({ ...where })
      .getQuery()
      .getSingleScalarResult()
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */
  static CREATE (data) {
    if (!data) throw new ErrorWrapper('requires data param', 500)

    let entity = new this.Entity()
    this.SET_DATA(entity, data)

    return this.MANAGER.persist(entity).flush()
      .then(() => entity)
      .catch(error => {
        throw new ErrorWrapper(error, error.status)
      })
  }

  static UPDATE (id, date) {
    if (!id) throw new ErrorWrapper('requires id param', 500)
    // TODO
  }

  static REMOVE (id) {
    if (!id) throw new ErrorWrapper('requires id param', 500)
    // TODO
  }

  static GETById (id) {
    if (!id) throw new ErrorWrapper('requires id param', 500)

    return this.MANAGER.getRepository(this.Entity).findOne({ id })
      .then(model => {
        if (model) return model
        throw new ErrorWrapper('Empty response', 404)
      })
      .catch(error => {
        throw new ErrorWrapper(error, error.status)
      })
  }

  static GETall (whereParams, optionsParams) {
    const where = whereParams || {}
    const options = optionsParams || {}

    let list = []
    let total = 0

    return this.MANAGER.getRepository(this.Entity).find({ ...where }, { ...options })
      .then(result => {
        if (result) return (list = result)
        throw new ErrorWrapper('Empty response', 404)
      })
      .then(() => this.GET_TOTAL())
      .then(result => (total = parseInt(result)))
      .then(() => ({ list, total }))
      .catch(error => {
        throw new ErrorWrapper(error, error.status)
      })
  }
}

module.exports = BaseRepository

