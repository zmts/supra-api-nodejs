const Wetland = require('wetland').Wetland
const EntityRepository = require('wetland').EntityRepository

const config = require('../wetland')
const ErrorWrapper = require('../util/error')

class BaseRepository extends EntityRepository {
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */
  static get Entity () {
    // must be defined in child class
  }

  static get MANAGER () {
    return new Wetland(config).getManager()
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */
  static CREATE (data) {
    if (!data) throw new ErrorWrapper('requires data param', 500)

    let entity = new this.Entity()
    entity.username = data.username
    entity.email = data.email

    return this.MANAGER.persist(entity).flush()
      .then(() => entity)
      .catch(error => { throw new Error(error) })
  }

  static UPDATE (id, date) {
    //
  }

  static REMOVE (id) {
    //
  }

  static GETById (id) {
    //
  }
}

module.exports = BaseRepository

