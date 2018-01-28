// const ErrorWrapper = require('../util/error')
const User = require('../entities/user')
const BaseRepository = require('./base')

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
