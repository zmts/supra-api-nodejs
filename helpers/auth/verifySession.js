const { errorCodes, ErrorWrapper } = require('supra-core')

module.exports = (session, newFingerprint) => {
  __typecheck(session, __type.object, true)
  __typecheck(session.fingerprint, __type.string, true)
  __typecheck(newFingerprint, __type.string, true)

  return new Promise((resolve, reject) => {
    const sessionExpiredAt = Number(session.expiredAt)
    const oldFingerprint = session.fingerprint
    const nowTime = parseInt(new Date().getTime() / 1000)

    if (nowTime > sessionExpiredAt) return reject(new ErrorWrapper({ ...errorCodes.TOKEN_EXPIRED }))
    // if (oldIp !== newIp) return reject(new ErrorWrapper({ ...errorCodes.INVALID_SESSION })) // for best security
    if (oldFingerprint !== newFingerprint) return reject(new ErrorWrapper({ ...errorCodes.INVALID_SESSION }))
    return resolve()
  })
}
