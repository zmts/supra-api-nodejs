const { errorCodes, AppError, assert } = require('supra-core')

function verifySession (session, newFingerprint) {
  assert.object(session, { notEmpty: true })
  assert.integer(session.expiredAt, { required: true })
  assert.string(session.fingerprint, { notEmpty: true })
  assert.string(newFingerprint, { notEmpty: true })

  return new Promise((resolve, reject) => {
    const sessionExpiredAt = session.expiredAt
    const oldFingerprint = session.fingerprint
    const nowTime = new Date().getTime()

    if (nowTime > sessionExpiredAt) return reject(new AppError({ ...errorCodes.TOKEN_EXPIRED }))
    // if (oldIp !== newIp) return reject(new AppError({ ...errorCodes.INVALID_SESSION })) // for best security
    if (oldFingerprint !== newFingerprint) return reject(new AppError({ ...errorCodes.INVALID_SESSION }))
    return resolve()
  })
}

module.exports = { verifySession }
