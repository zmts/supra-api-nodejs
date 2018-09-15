const { UserAbstractDAO } = require('../../dao')

class GetCurrentUserLogic {
  static exec ({ currentUserId }) {
    __typecheck(currentUserId, __type.number, true)

    return UserAbstractDAO.GetCurrentUser(currentUserId)
  }
}

module.exports = GetCurrentUserLogic
