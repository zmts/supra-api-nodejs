const { BaseDbDto } = require('./BaseDbDto')

class RefreshSessionDbDto extends BaseDbDto {
  constructor (src = {}) {
    super(src)

    this.refreshToken = src.refreshToken
    this.userId = src.userId
    this.fingerprint = src.fingerprint
    this.ip = src.ip
    this.expiresIn = src.expiresIn
    this.ua = src.ua
  }
}

module.exports = { RefreshSessionDbDto }
