const { assert } = require('supra-core')
const SessionDAO = require('../../../dao/SessionDAO')
const SessionEntity = require('./SessionEntity')

const MAX_SESSIONS_COUNT = 5

module.exports = async session => {
  if (!(session instanceof SessionEntity)) {
    throw new Error('Wrong SessionEntity')
  }

  if (await _isValidSessionsCount(session.userId)) {
    await _addSession(session)
  } else {
    await _wipeAllUserSessions(session.userId)
    await _addSession(session)
  }
}

async function _isValidSessionsCount (userId) {
  assert.integer(userId, { required: true, positive: true })

  const existingSessionsCount = await SessionDAO.baseGetCount({ userId })
  return existingSessionsCount < MAX_SESSIONS_COUNT
}

async function _addSession (session) {
  // for better performance store sessions in Redis persistence
  await SessionDAO.baseCreate(session)
}

async function _wipeAllUserSessions (userId) {
  assert.integer(userId, { required: true, positive: true })
  return await SessionDAO.baseRemoveWhere({ userId })
}
