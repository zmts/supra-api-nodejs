const { errorCodes, AppError, assert } = require('supra-core')
const { SessionEntity } = require('./SessionEntity')

function verifySession (oldSession, newFingerprint) {
  assert.instanceOf(oldSession, SessionEntity)
  assert.string(newFingerprint, { notEmpty: true })

  return new Promise((resolve, reject) => {
    const nowTime = new Date().getTime()

    if (nowTime > oldSession.expiresIn) return reject(new AppError({ ...errorCodes.SESSION_EXPIRED }))
    // if (oldIp !== newIp) return reject(new AppError({ ...errorCodes.INVALID_SESSION })) // for best security
    if (oldSession.fingerprint !== newFingerprint) return reject(new AppError({ ...errorCodes.INVALID_SESSION }))
    return resolve()
  })
}

module.exports = { verifySession }
