const { Stream } = require('stream')

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const URL_REGEXP = /^(https?|ftps?):\/\/[^\s/$.?#].[^\s]*$/i
const IP_REGEXP = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/i

const validTypes = [Number, String, Object, Array, Boolean, Function]

function isObject (v) {
  return v && (typeof v === 'object') && !Array.isArray(v)
}

class ValidatorNano {
  static isInstanceOf (value, parent) {
    return value instanceof parent
  }

  static isTypeOf (value, type) {
    if (!validTypes.includes(type)) {
      throw new TypeError(`ValidatorNano.typeOf accept one of [${validTypes.map(t => t.name)}] types. Use another method to validate "${type}"`)
    }

    if ((type === Number) && (typeof value === 'number') && !isNaN(value)) return true
    if ((type === String) && typeof value === 'string') return true
    if ((type === Object) && isObject(value)) return true
    if ((type === Array) && Array.isArray(value)) return true
    if ((type === Boolean) && typeof value === 'boolean') return true
    if ((type === Function) && typeof value === 'function') return true
    return false
  }

  static isArray (value, { notEmpty = false, of = [] } = {}) {
    if (!Array.isArray(of)) {
      throw new TypeError('"of" option expect an Array type')
    }
    if (!of.every(i => validTypes.includes(i))) {
      throw new TypeError(`ValidatorNano.array 'of' option accept only one of [${validTypes.map(t => t.name)}] types`)
    }

    const isArray = this.isTypeOf(value, Array)
    if (notEmpty && isArray && !value.length) return false
    if (isArray && value.length && of.length && !value.every(i => of.includes(i.constructor))) return false
    return isArray
  }

  static isObject (value, { notEmpty = false } = {}) {
    const isObj = this.isTypeOf(value, Object)
    if (isObj && notEmpty && !Object.keys(value).length) return false
    return isObj
  }

  static isNumber (value) {
    return this.isTypeOf(value, Number)
  }

  static isInteger (value, { min, max } = {}) {
    if (min && !this.isNumber(min)) {
      throw new TypeError('Invalid min param. Should be a number')
    }
    if (max && !this.isNumber(max)) {
      throw new TypeError('Invalid max param. Should be a number')
    }
    const isValueInteger = Number.isInteger(value)

    if (isValueInteger && value < min) return false
    if (isValueInteger && value > max) return false
    return isValueInteger
  }

  static isString (value, { notEmpty = false } = {}) {
    const isString = this.isTypeOf(value, String)
    if (notEmpty && isString && !value.length) return false
    return isString
  }

  static isBoolean (value) {
    return this.isTypeOf(value, Boolean)
  }

  static isBuffer (value, { notEmpty = false } = {}) {
    const isBuffer = Buffer.isBuffer(value)
    if (notEmpty && isBuffer && !value.length) return false
    return isBuffer
  }

  static isDate (value) {
    return this.isInstanceOf(value, Date)
  }

  static isFunc (value) {
    return this.isInstanceOf(value, Function)
  }

  static isStream (value) {
    return this.isInstanceOf(value, Stream)
  }

  static isId (value) {
    const int = Number(value)
    const isPositiveInteger = Number.isInteger(int) && int >= 1
    const isUiid = UUID_REGEXP.test(value)
    return isPositiveInteger || isUiid
  }

  static isUuid (value) {
    return UUID_REGEXP.test(value)
  }

  static isUrl (value) {
    return URL_REGEXP.test(value)
  }

  static isIP (value) {
    return IP_REGEXP.test(value)
  }
}

module.exports = { ValidatorNano }
