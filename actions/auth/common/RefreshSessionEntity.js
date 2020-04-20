const { assert } = require('supra-core')
const { v4: uuidv4 } = require('uuid')
const { UserModel } = require('../../../models/UserModel')
const { SessionModel } = require('../../../models/SessionModel')

class RefreshSessionEntity {
  constructor ({ userId, fingerprint, ip, ua, expiresIn } = {}) {
    assert.validate(userId, UserModel.schema.id, { required: true })
    assert.validate(fingerprint, SessionModel.schema.fingerprint, { required: true })
    assert.validate(ip, SessionModel.schema.ip, { required: true })
    assert.validate(expiresIn, SessionModel.schema.expiresIn, { required: true })
    assert.validate(ua, SessionModel.schema.ua)

    this.refreshToken = uuidv4()
    this.userId = userId
    this.fingerprint = fingerprint
    this.ip = ip
    this.expiresIn = expiresIn
    this.ua = ua || null
  }
}

module.exports = { RefreshSessionEntity }
