const { errorCodes, AppError, assert } = require('supra-core')
const { SessionEntity } = require('./SessionEntity')

function verifySession (session, newFingerprint) {
  assert.instanceOf(session, SessionEntity)
  assert.string(newFingerprint, { notEmpty: true })

  return new Promise((resolve, reject) => {
    const sessionExpiresIn = session.expiresIn
    const oldFingerprint = session.fingerprint
    const nowTime = new Date().getTime()

    if (nowTime > sessionExpiresIn) return reject(new AppError({ ...errorCodes.SESSION_EXPIRED }))
    // if (oldIp !== newIp) return reject(new AppError({ ...errorCodes.INVALID_SESSION })) // for best security
    if (oldFingerprint !== newFingerprint) return reject(new AppError({ ...errorCodes.INVALID_SESSION }))
    return resolve()
  })
}

module.exports = { verifySession }
