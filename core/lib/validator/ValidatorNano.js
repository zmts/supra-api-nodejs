const { Stream } = require('stream')

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const URL_REGEXP = /^(https?|ftps?):\/\/[^\s/$.?#].[^\s]*$/i
const IP_REGEXP = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/i

class ValidatorNano {
  static isDefined (value) {
    return typeof value !== 'undefined'
  }

  static isInstanceOf (value, parent) {
    return value instanceof parent
  }

  static isArray (value) {
    return Array.isArray(value)
  }

  static isArrayNotEmpty (value) {
    return Boolean(Array.isArray(value) && value.length)
  }

  static isArrayOf (value, of = [Number, String, Object, Array, Boolean, Function]) {
    return Array.isArray(value) && of.length && value.every(i => of.includes(i.constructor))
  }

  static isObject (value) {
    return (typeof value === 'object') && !Array.isArray(value)
  }

  static isNumber (value) {
    return typeof value === 'number' && !isNaN(value)
  }

  static isStringNumber (value) {
    return typeof value === 'string' && !isNaN(Number(value))
  }

  static isInt (value) {
    return Number.isInteger(value)
  }

  static isUint (value) {
    return Number.isInteger(value) && value >= 0
  }

  static isStringInt (value) {
    return typeof value === 'string' && Number.isInteger(Number(value))
  }

  static isString (value) {
    return typeof value === 'string'
  }

  static isBoolean (value) {
    return typeof value === 'boolean'
  }

  static isBuffer (value) {
    return Buffer.isBuffer(value)
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
