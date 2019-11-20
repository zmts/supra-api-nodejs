const { assert } = require('supra-core')
const SessionDAO = require('../../../dao/SessionDAO')
const { SessionEntity } = require('./SessionEntity')
const UserModel = require('../../../models/UserModel')

const MAX_SESSIONS_COUNT = 5

async function addSession (session) {
  assert.instanceOf(session, SessionEntity)

  if (await _isValidSessionsCount(session.userId)) {
    await _addSession(session)
  } else {
    await _wipeAllUserSessions(session.userId)
    await _addSession(session)
  }
}

async function _isValidSessionsCount (userId) {
  assert.validate(userId, UserModel.schema.id, { required: true })

  const existingSessionsCount = await SessionDAO.baseGetCount({ userId })
  return existingSessionsCount < MAX_SESSIONS_COUNT
}

async function _addSession (session) {
  // for better performance store sessions in Redis persistence
  await SessionDAO.baseCreate(session)
}

async function _wipeAllUserSessions (userId) {
  assert.validate(userId, UserModel.schema.id, { required: true })
  return await SessionDAO.baseRemoveWhere({ userId })
}

module.exports = { addSession }
