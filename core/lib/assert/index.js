const AssertionError = require('./AssertionError')
const Rule = require('../Rule')

const util = require('util')
var { Stream } = require('stream')

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const URL_REGEXP = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i

class Assert {
  static fail (actual, expected, message) {
    throw new AssertionError(message || `Failed value: ${util.inspect(actual)}; ${expected !== undefined ? `Expect: ${util.inspect(expected.name || expected)}` : ''}`)
  }

  static validate (value, rule, { required = false } = {}) {
    Assert.instanceOf(rule, Rule)
    const validationResult = rule.validator(value)
    if (!['boolean', 'string'].includes(typeof validationResult)) {
      Assert.fail(validationResult, null, 'Validation result error. Validator should return string or boolean. Please check validation function')
    }

    if (required) {
      if (typeof validationResult === 'string') Assert.fail(value, validationResult)
      if (typeof validationResult === 'boolean' && !validationResult) Assert.fail(value, rule.description)
    }

    if (value !== undefined && !required) {
      if (typeof validationResult === 'string') Assert.fail(value, validationResult)
      if (typeof validationResult === 'boolean' && !validationResult) Assert.fail(value, rule.description)
    }
  }

  static isOk (value, { message = '', required = false } = {}) {
    if (!value && required) Assert.fail(value, 'Truthful value', message)
    if (value !== undefined && !value) Assert.fail(value, 'Truthful value', message)
  }

  static defined (value, { message = '' } = {}) {
    if (value === undefined) Assert.fail(value, 'No undefined values', message)
  }

  static instanceOf (value, type, { message = '' } = {}) {
    if (!(value instanceof type)) {
      Assert.fail(value, type, message || `Failed instance: ${util.inspect(value)}; Expect instance of ${util.inspect(type.name || type)} class`)
    }
  }

  static typeOf (value, type, message) {
    const types = [Number, String, Object, Array, Boolean, Function]
    if (!types.includes(type)) {
      Assert.fail(value, type, message || `Assert.typeOf accept one of [${types.map(t => t.name)}] types. Use another method to validate "${type}"`)
    }

    if (value === undefined) Assert.fail(value, type, message)
    if (value === null) Assert.fail(value, type, message)
    if (typeof value === 'number' && isNaN(value)) Assert.fail(value, type, message)

    if ((type === Number) && Object.prototype.toString.call(value) === '[object Number]') return
    if ((type === String) && Object.prototype.toString.call(value) === '[object String]') return
    if ((type === Object) && Object.prototype.toString.call(value) === '[object Object]') return
    if ((type === Array) && Object.prototype.toString.call(value) === '[object Array]') return
    if ((type === Boolean) && Object.prototype.toString.call(value) === '[object Boolean]') return
    if ((type === Function) && Object.prototype.toString.call(value) === '[object Function]') return

    Assert.fail(value, type, message)
  }

  static array (value, { required = false, notEmpty = false, message = '', of = [] } = {}) {
    const validArrayTypes = [Number, String, Object, Array, Boolean, Function]
    if (!Array.isArray(of)) Assert.fail(of, 'of option expect an Array type')
    if (!of.every(i => validArrayTypes.includes(i))) {
      Assert.fail(value, of, message || `Assert.array 'of' option accept only one of [${validArrayTypes.map(t => t.name)}] types`)
    }
    if (required || notEmpty) Assert.typeOf(value, Array, message)
    if (value !== undefined) Assert.typeOf(value, Array, message)
    if (value && !value.length && notEmpty) Assert.fail(value, 'Not empty array')
    if (value && value.length && of.length && !value.every(i => of.includes(i.constructor))) Assert.fail(value, `Array of some [${of.map(t => t.name)}] types`)
  }

  static object (value, { required = false, notEmpty = false, message = '' } = {}) {
    if (required || notEmpty) Assert.typeOf(value, Object, message)
    if (value !== undefined) Assert.typeOf(value, Object, message)
    if (notEmpty && !Object.keys(value).length) Assert.fail(value, 'Not empty object', message)
  }

  static number (value, { required = false, message = '' } = {}) {
    if (required) Assert.typeOf(value, Number, message)
    if (value !== undefined) Assert.typeOf(value, Number, message)
  }

  static integer (value, { required = false, positive = false, message = '' } = {}) {
    if (required && !Number.isInteger(value)) Assert.fail(value, 'Integer', message)
    if (value !== undefined && !Number.isInteger(value)) Assert.fail(value, 'Integer', message)
    if (value !== undefined && Number.isInteger(value) && positive && value < 0) Assert.fail(value, 'Positive integer', message)
  }

  static string (value, { required = false, notEmpty = false, message = '' } = {}) {
    if (required || notEmpty) Assert.typeOf(value, String, message)
    if (value !== undefined) Assert.typeOf(value, String, message)
    if (value !== undefined && !value.trim().length && notEmpty) Assert.fail(value, 'Not empty string', message)
  }

  static boolean (value, { required = false, message = '' } = {}) {
    if (required) Assert.typeOf(value, Boolean, message)
    if (value !== undefined) Assert.typeOf(value, Boolean, message)
  }

  static buffer (value, { required = false, notEmpty = false, message = '' } = {}) {
    if (required && !Buffer.isBuffer(value)) Assert.fail(value, 'Buffer', message)
    if (value !== undefined && !Buffer.isBuffer(value)) Assert.fail(value, 'Buffer', message)
    if (!value.length && notEmpty) Assert.fail(value, 'Not empty buffer', message)
  }

  static date (value, { required = false, message = '' } = {}) {
    if (required) Assert.instanceOf(value, Date, message)
    if (value !== undefined) Assert.instanceOf(value, Date, message)
  }

  static func (value, { required = false, message = '' } = {}) {
    if (required) Assert.typeOf(value, Function, message)
    if (value !== undefined) Assert.instanceOf(value, Function, message)
  }

  static stream (value, { required = false, message = '' } = {}) {
    if (required) Assert.instanceOf(value, Stream, message)
    if (value !== undefined) Assert.instanceOf(value, Stream, message)
  }

  static id (value, { required = false, message = '' } = {}) {
    const isValidId = typeof value === 'number' || UUID_REGEXP.test(value)
    if (!isValidId && required) Assert.fail(value, 'UUID or Number', message)
    if (value !== undefined && !isValidId) Assert.fail(value, 'UUID or Number', message)
  }

  static uuid (value, { required = false, message = '' } = {}) {
    Assert.string(value, { required, message })
    if (value && !UUID_REGEXP.test(value)) Assert.fail(value, 'UUID', message)
  }

  static url (value, { required = false, message = '' } = {}) {
    Assert.string(value, { required, message })
    if (value && !URL_REGEXP.test(value)) Assert.fail(value, 'URL', message)
  }
}

module.exports = process.env.NODE_NOASSERT ? Object.getOwnPropertyNames(Assert).forEach(key => (Assert[key] = function noAssert () {})) : Assert
