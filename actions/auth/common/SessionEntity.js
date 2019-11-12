const { assert, ErrorWrapper, errorCodes } = require('supra-core')
const ms = require('ms')
const uuidV4 = require('uuid/v4')
const config = require('../../../config')
const UserModel = require('../../../models/UserModel')
const SessionModel = require('../../../models/SessionModel')

const expiredAtPeriodSec = ms(config.token.refresh.expiresIn)

class SessionEntity {
  constructor (src = {}) {
    assert.validate(src.userId, UserModel.schema.id, { required: true })
    assert.validate(src.fingerprint, SessionModel.schema.fingerprint, { required: true })
    assert.validate(src.ip, SessionModel.schema.ip, { required: true })
    assert.validate(src.ua, SessionModel.schema.ua)
    if (src.expiredAt !== undefined && !Number(src.expiredAt)) {
      throw new ErrorWrapper({ ...errorCodes.UNPROCESSABLE_ENTITY, message: 'Invalid expiredAt value' })
    }

    this.refreshToken = uuidV4()
    this.userId = src.userId
    this.fingerprint = src.fingerprint
    this.ip = src.ip
    this.ua = src.ua || null
    this.expiredAt = Number(src.expiredAt) || new Date().getTime() + expiredAtPeriodSec
  }
}

module.exports = SessionEntity
