const { errorCodes, AppError, assert } = require('supra-core')
const { RefreshSessionEntity } = require('./RefreshSessionEntity')

function verifyRefreshSession (oldRefreshSession, newFingerprint) {
  assert.instanceOf(oldRefreshSession, RefreshSessionEntity)
  assert.string(newFingerprint, { notEmpty: true })

  const nowTime = new Date().getTime()

  if (nowTime > oldRefreshSession.expiresIn) throw new AppError({ ...errorCodes.SESSION_EXPIRED })
  // if (oldIp !== newIp) throw new AppError({ ...errorCodes.INVALID_REFRESH_SESSION }) // for best security
  if (oldRefreshSession.fingerprint !== newFingerprint) throw new AppError({ ...errorCodes.INVALID_REFRESH_SESSION })
}

module.exports = { verifyRefreshSession }
