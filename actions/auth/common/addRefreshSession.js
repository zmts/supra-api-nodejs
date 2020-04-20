const { assert } = require('supra-core')
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO')
const { RefreshSessionEntity } = require('./RefreshSessionEntity')
const { UserModel } = require('../../../models/UserModel')

const MAX_REFRESH_SESSIONS_COUNT = 5

async function addRefreshSession (refreshSession) {
  assert.instanceOf(refreshSession, RefreshSessionEntity)

  if (await _isValidSessionsCount(refreshSession.userId)) {
    await _addRefreshSession(refreshSession)
  } else {
    await _wipeAllUserRefreshSessions(refreshSession.userId)
    await _addRefreshSession(refreshSession)
  }
}

async function _isValidSessionsCount (userId) {
  assert.validate(userId, UserModel.schema.id, { required: true })

  const existingSessionsCount = await RefreshSessionDAO.baseGetCount({ userId })
  return existingSessionsCount < MAX_REFRESH_SESSIONS_COUNT
}

async function _addRefreshSession (refreshSession) {
  // for better performance store refresh sessions in Redis persistence
  await RefreshSessionDAO.baseCreate(refreshSession)
}

async function _wipeAllUserRefreshSessions (userId) {
  assert.validate(userId, UserModel.schema.id, { required: true })
  return await RefreshSessionDAO.baseRemoveWhere({ userId })
}

module.exports = { addRefreshSession }
