// const ErrorWrapper = require('../util/Error')
const User = require('../entities/User')
const BaseRepository = require('./Base')

class UserRepository extends BaseRepository {
  static get Entity () {
    return User
  }

  static Update (id, date) {
    //
  }

  static Remove (id) {
    //
  }

  static GetById (id) {
    //
  }
}

module.exports = UserRepository
