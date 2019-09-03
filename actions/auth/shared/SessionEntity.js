const ms = require('ms')
const uuidV4 = require('uuid/v4')
const config = require('../../../config')

const expiredAtPeriodSec = ms(config.token.refresh.expiresIn)

class SessionEntity {
  constructor (src = {}) {
    this.refreshToken = uuidV4()
    this.userId = Number(src.userId) || required('userId')
    this.fingerprint = src.fingerprint || required('fingerprint')
    this.ip = src.ip || required('ip')
    this.os = src.os || null
    this.ua = src.ua || null
    this.browser = src.browser || null
    this.expiredAt = parseInt(new Date().getTime() / 1000) + expiredAtPeriodSec
  }
}

function required (name) {
  throw new Error(`Required parameter "${name}" not supplied`)
}

module.exports = SessionEntity
