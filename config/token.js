const { BaseConfig } = require('supra-core')
const expiresInRegexp = /^(\d\d?m$|\d\d?h$|\d\d?d$)/ // valid minutes, hours, days like: 1m, 1h, 1d, 11m, 11h, 11d

class TokenConfig extends BaseConfig {
  constructor () {
    super()

    this.jwtIss = this.set('JWT_ISS', this.joi.string().required())

    this.access = {
      type: 'TOKEN_TYPE_ACCESS',
      secret: this.set('TOKEN_ACCESS_SECRET', this.joi.string().min(30).max(100).required()),
      expiresIn: this.set('TOKEN_ACCESS_EXP', this.joi.string().regex(expiresInRegexp).required()),
      toString () {
        return JSON.stringify({
          type: this.type,
          secret: `${this.secret.substr(0, 1)}****${this.secret.substr(this.secret.length - 1)}`,
          expiresIn: this.expiresIn
        })
      }
    }

    this.refresh = {
      type: 'TOKEN_TYPE_REFRESH',
      expiresIn: this.set('TOKEN_REFRESH_EXP', this.joi.string().regex(expiresInRegexp).required())
    }

    this.resetPassword = {
      type: 'TOKEN_TYPE_RESET_PASSWORD',
      secret: this.set('TOKEN_RESET_PASSWORD_SECRET', this.joi.string().min(30).max(100).required()),
      expiresIn: this.set('TOKEN_RESET_PASSWORD_EXP', this.joi.string().regex(expiresInRegexp)),
      toString () {
        return JSON.stringify({
          type: this.type,
          secret: `${this.secret.substr(0, 1)}****${this.secret.substr(this.secret.length - 1)}`,
          expiresIn: this.expiresIn
        })
      }
    }

    this.emailConfirm = {
      type: 'TOKEN_TYPE_EMAIL_CONFIRM',
      secret: this.set('TOKEN_EMAIL_CONFIRM_SECRET', this.joi.string().min(30).max(100).required()),
      expiresIn: this.set('TOKEN_EMAIL_CONFIRM_EXP', this.joi.string().regex(expiresInRegexp).required()),
      toString () {
        return JSON.stringify({
          type: this.type,
          secret: `${this.secret.substr(0, 1)}****${this.secret.substr(this.secret.length - 1)}`,
          expiresIn: this.expiresIn
        })
      }
    }
  }
}

module.exports = new TokenConfig()
