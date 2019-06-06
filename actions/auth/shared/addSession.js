const SessionDAO = require('../../../dao/SessionDAO')
const SessionEntity = require('../../../entities/SessionEntity')
const VALID_SESSIONS_COUNT = 5

module.exports = async ({ session, user }) => {
  __typecheck(user, __type.object, true)
  if (!(session instanceof SessionEntity)) {
    throw new Error('Wrong SessionEntity')
  }

  if (await _isValidSessionsCount(user.id)) {
    await _addSession(session)
  } else {
    await _wipeAllUserSessions(user.id)
    await _addSession(session)
  }
}

async function _isValidSessionsCount (userId) {
  __typecheck(userId, __type.number, true)

  const existingSessionsCount = await SessionDAO.baseGetCount({ userId })
  return existingSessionsCount < VALID_SESSIONS_COUNT
}

async function _addSession (session) {
  // for better performance store sessions in Redis persistence
  await SessionDAO.baseCreate(session)
}

async function _wipeAllUserSessions (userId) {
  __typecheck(userId, __type.number, true)
  return await SessionDAO.baseRemoveWhere({ userId })
}
