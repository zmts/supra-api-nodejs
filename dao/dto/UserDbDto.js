const { BaseDbDto } = require('./BaseDbDto')

class UserDbDto extends BaseDbDto {
  constructor (src = {}) {
    super(src)

    this.username = src.username
    this.name = src.name
    this.role = src.role
    this.location = src.location
    // sensitive data
    this.passwordHash = src.passwordHash
    this.emailConfirmToken = src.emailConfirmToken
    this.resetPasswordToken = src.resetPasswordToken
    this.newEmail = src.newEmail
    this.email = src.email

    delete this.userId
  }

  toJSON () {
    // delete sensitive data from json
    delete this.passwordHash
    delete this.emailConfirmToken
    delete this.resetPasswordToken
    delete this.newEmail
    delete this.email

    return this
  }
}

module.exports = { UserDbDto }
