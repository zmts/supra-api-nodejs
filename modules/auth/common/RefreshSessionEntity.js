const { assert } = require('supra-core')
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel')

class RefreshSessionEntity {
  constructor ({ refreshToken, userId, fingerprint, ip, ua, expiresIn } = {}) {
    assert.validate(refreshToken, RefreshSessionModel.schema.refreshToken, { required: true })
    assert.validate(userId, RefreshSessionModel.schema.userId, { required: true })
    assert.validate(fingerprint, RefreshSessionModel.schema.fingerprint, { required: true })
    assert.validate(fingerprint, RefreshSessionModel.schema.fingerprint, { required: true })
    assert.validate(ip, RefreshSessionModel.schema.ip, { required: true })
    assert.validate(expiresIn, RefreshSessionModel.schema.expiresIn, { required: true })
    assert.validate(ua, RefreshSessionModel.schema.ua, { allowed: [null] })

    this.refreshToken = refreshToken
    this.userId = userId
    this.fingerprint = fingerprint
    this.ip = ip
    this.expiresIn = expiresIn
    this.ua = ua
  }
}

module.exports = { RefreshSessionEntity }
