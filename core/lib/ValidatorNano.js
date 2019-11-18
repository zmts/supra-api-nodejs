const { Stream } = require('stream')
// const assert = require('./assert')

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const URL_REGEXP = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i

// TODO: Class in not dev ready; needs to checked all methods implementation
// TODO: Add tests
// TODO: Add assertion

class ValidatorNano {
  static isOk (value) {
    return Boolean(value)
  }

  static isDefined (value) {
    return value !== undefined
  }

  static isInstanceOf (value, type) {
    return value instanceof type
  }

  static isTypeOf (value, type) {
    const types = [Number, String, Object, Array, Boolean, Function]
    if (!types.includes(type)) {
      throw new Error(`ValidatorNano.isTypeOf accept one of [${types.map(t => t.name)}] types. Use another method to validate "${type}"`)
    }

    if (typeof value === 'number' && isNaN(value)) return false

    if ((type === Number) && Object.prototype.toString.call(value) === '[object Number]') return true
    if ((type === String) && Object.prototype.toString.call(value) === '[object String]') return true
    if ((type === Object) && Object.prototype.toString.call(value) === '[object Object]') return true
    if ((type === Array) && Object.prototype.toString.call(value) === '[object Array]') return true
    if ((type === Boolean) && Object.prototype.toString.call(value) === '[object Boolean]') return true
    if ((type === Function) && Object.prototype.toString.call(value) === '[object Function]') return true
    if ((type === Function) && Object.prototype.toString.call(value) === '[object AsyncFunction]') return true

    return false
  }

  static isArray (value, { notEmpty = false, of = [] } = {}) {
    const validArrayTypes = [Number, String, Object, Array, Boolean, Function]
    if (!Array.isArray(of)) return false
    if (!of.every(i => validArrayTypes.includes(i))) {
      return false
    }
    if (!ValidatorNano.isTypeOf(value, Array)) return false
    if (!value.length && notEmpty) return false
    if (value.length && of.length && !value.every(i => of.includes(i.constructor))) return false
    return true
  }

  static isObject (value, { notEmpty = false } = {}) {
    if (!ValidatorNano.isTypeOf(value, Object)) return false
    if (notEmpty && !Object.keys(value).length) return false
    return true
  }

  static isNumber (value) {
    return ValidatorNano.isTypeOf(value, Number)
  }

  static isInteger (value, { likeString = false, min = 0, max = 0 } = {}) {
    if (likeString) {
      const tmpValue = Number(value)
      const isInteger = Number.isInteger(tmpValue)
      if (!isInteger) return false
      if (min && (tmpValue < min)) return false
      if (max && (tmpValue > max)) return false
    } else {
      const isInteger = Number.isInteger(value)
      if (!isInteger) return false
      if (min && (value < min)) return false
      if (max && (value > max)) return false
    }
    return true
  }

  static isString (value, { notEmpty = false } = {}) {
    if (!ValidatorNano.isTypeOf(value, String)) return false
    if (!value.trim().length && notEmpty) return false
    return true
  }

  static isBoolean (value) {
    return ValidatorNano.isTypeOf(value, Boolean)
  }

  static isBuffer (value, { notEmpty = false } = {}) {
    const buffer = Buffer.isBuffer(value)
    if (buffer && !value.length && notEmpty) return false
    return buffer
  }

  static isDate (value) {
    return ValidatorNano.isInstanceOf(value, Date)
  }

  static isFunc (value) {
    return ValidatorNano.isInstanceOf(value, Function)
  }

  static isStream (value) {
    return ValidatorNano.isInstanceOf(value, Stream)
  }

  static isId (value) {
    return ValidatorNano.isInteger(value, { likeString: true, min: 1 }) || UUID_REGEXP.test(value)
  }

  static isUuid (value) {
    return ValidatorNano.isString(value) && !UUID_REGEXP.test(value)
  }

  static isUrl (value) {
    return ValidatorNano.isString(value) && URL_REGEXP.test(value)
  }
}

module.exports = { ValidatorNano }
