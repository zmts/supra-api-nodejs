const { assert } = require('supra-core')
const { v4: uuidv4 } = require('uuid')
const { UserModel } = require('../../../models/UserModel')
const { RefreshSessionModel } = require('../../../models/RefreshSessionModel')

class RefreshSessionEntity {
  constructor ({ userId, fingerprint, ip, ua, expiresIn } = {}) {
    assert.validate(userId, UserModel.schema.id, { required: true })
    assert.validate(fingerprint, RefreshSessionModel.schema.fingerprint, { required: true })
    assert.validate(ip, RefreshSessionModel.schema.ip, { required: true })
    assert.validate(expiresIn, RefreshSessionModel.schema.expiresIn, { required: true })
    assert.validate(ua, RefreshSessionModel.schema.ua)

    this.refreshToken = uuidv4()
    this.userId = userId
    this.fingerprint = fingerprint
    this.ip = ip
    this.expiresIn = expiresIn
    this.ua = ua || null
  }
}

module.exports = { RefreshSessionEntity }
