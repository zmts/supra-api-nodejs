const UserDAO = require('../UserDAO')

class UserAbstractDAO {
  static GetCurrentUser (currentUserId) {
    __typecheck(currentUserId, __type.number, true)

    return UserDAO.BaseGetById(currentUserId)
  }
}

module.exports = UserAbstractDAO
