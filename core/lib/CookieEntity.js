const { Assert: assert } = require('./assert')
const { ValidatorNano: validator } = require('./validator/ValidatorNano')
const validSameSiteValues = ['lax', 'none', 'strict', true, false]

class CookieEntity {
  constructor ({ name, value, maxAge, domain, path, httpOnly, signed, secure, sameSite } = {}) {
    assert.string(name, { required: true })
    assert.defined(value, { required: true })
    assert.integer(maxAge)
    assert.string(domain)
    assert.boolean(httpOnly)
    assert.boolean(signed)
    assert.boolean(secure)
    if (validator.isDefined(sameSite) && !validSameSiteValues.includes(sameSite)) {
      assert.fail(sameSite, validSameSiteValues)
    }

    this.name = name
    this.value = value
    this.options = {
      ...(validator.isDefined(maxAge) && { maxAge }),
      domain: validator.isDefined(domain) ? domain : '',
      path: validator.isDefined(path) ? path : '/',
      httpOnly: validator.isDefined(httpOnly) ? httpOnly : true,
      signed: validator.isDefined(signed) ? signed : true,
      secure: validator.isDefined(secure) ? secure : true,
      sameSite: validator.isDefined(sameSite) ? sameSite : true
    }
  }
}

module.exports = { CookieEntity }
