const ms = require('ms')
const uuidV4 = require('uuid/v4')
const { assert } = require('supra-core')
const config = require('../../../config')
const UserModel = require('../../../models/UserModel')
const SessionModel = require('../../../models/SessionModel')

const expiredAtPeriodSec = ms(config.token.refresh.expiresIn)

class SessionEntity {
  constructor (src = {}) {
    assert.validate(src.userId, UserModel.schema.id, { required: true })
    assert.validate(src.fingerprint, SessionModel.schema.fingerprint, { required: true })
    assert.validate(src.ip, SessionModel.schema.ip, { required: true })
    assert.validate(src.os, SessionModel.schema.os)
    assert.validate(src.ua, SessionModel.schema.ua)
    assert.validate(src.browser, SessionModel.schema.ua)

    this.refreshToken = uuidV4()
    this.userId = src.userId
    this.fingerprint = src.fingerprint
    this.ip = src.ip
    this.os = src.os || null
    this.ua = src.ua || null
    this.browser = src.browser || null
    this.expiredAt = parseInt(new Date().getTime() / 1000) + expiredAtPeriodSec
  }
}

module.exports = SessionEntity
