const AssertionError = require('./AssertionError')

const util = require('util')
var { Stream } = require('stream')

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const URL_REGEXP = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i

class Assert {
  static fail (actual, expected, message) {
    throw new AssertionError(message || `Failed value: ${util.inspect(actual)}; ${expected !== undefined ? `Expect: ${util.inspect(expected.name || expected)}` : ''}`)
  }

  static isOk (value, { message = '' } = {}) {
    if (!value) Assert.fail(value, 'Truthful value', message)
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
      Assert.fail(value, type, `Assert.typeOf accept one of [${types.map(t => t.name)}] types. Use another method to validate "${type}"`)
    }

    if (value === undefined) Assert.fail(value, type)
    if (value === null) Assert.fail(value, type)
    if (isNaN(value)) Assert.fail(value, type)
    if (value.constructor === type) return
    if (type === Function && typeof value === 'function') return
    if (type === Array && Array.isArray(value)) return

    Assert.fail(value, type, message)
  }

  static object (value, { required = false, message = '' } = {}) {
    if (required) Assert.typeOf(value, Object, message)
    if (value !== undefined) Assert.typeOf(value, Object, message)
  }

  static array (value, { required = false, notEmpty = false, message = '' } = {}) {
    if (required) Assert.typeOf(value, Array, message)
    if (value !== undefined) Assert.typeOf(value, Array, message)
    if (value && !value.length && notEmpty) Assert.fail(value, 'Not empty array')
  }

  static arrayOfStrings (value, { required = false, notEmpty = false, message = '' } = {}) {
    Assert.array(value, { required, message })
    if (value && notEmpty && !value.length) Assert.array(value, { notEmpty: true })
    if (value && value.length && !value.every(i => typeof i === 'string')) Assert.fail(value, 'Array of strings')
  }

  static arrayOfNumbers (value, { required = false, notEmpty = false, message = '' } = {}) {
    Assert.array(value, { required, message })
    if (value && notEmpty && !value.length) Assert.array(value, { notEmpty: true })
    if (value && value.length && !value.every(i => typeof i === 'number')) Assert.fail(value, 'Array of numbers')
  }

  static arrayOfObjects (value, { required = false, notEmpty = false, message = '' } = {}) {
    Assert.array(value, { required, message })
    if (value && notEmpty && !value.length) Assert.array(value, { notEmpty: true })
    if (value && value.length && !value.every(i => i && i.constructor === Object)) Assert.fail(value, 'Array of objects')
  }

  static arrayOfNumbersOrStrings (value, { required = false, notEmpty = false, message = '' } = {}) {
    Assert.array(value, { required, message })
    if (value && notEmpty && !value.length) Assert.array(value, { notEmpty: true })
    if (value && value.length && (!value.every(i => (typeof i === 'number') || (typeof i === 'string')))) Assert.fail(value, 'Array of numbers or strings')
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
    if (required) Assert.typeOf(value, String, message)
    if (value !== undefined) Assert.typeOf(value, String, message)
    if (!value.trim().length && notEmpty) Assert.fail(value, 'Not empty string')
  }

  static boolean (value, { required = false, message = '' } = {}) {
    if (required) Assert.typeOf(value, Boolean, message)
    if (value !== undefined) Assert.typeOf(value, Boolean, message)
  }

  static buffer (value, { required = false, notEmpty = false, message = '' } = {}) {
    if (required && !Buffer.isBuffer(value)) Assert.fail(value, 'Buffer', message)
    if (value !== undefined && !Buffer.isBuffer(value)) Assert.fail(value, 'Buffer', message)
    if (!value.length && notEmpty) Assert.fail(value, 'Not empty buffer')
  }

  static date (value, { required = false, message = '' } = {}) {
    if (required) Assert.instanceOf(value, Date, message)
    if (value !== undefined) Assert.instanceOf(value, Date, message)
  }

  static func (value, { required = false, message = '' } = {}) {
    if (required) Assert.instanceOf(value, Function, message)
    if (value !== undefined) Assert.instanceOf(value, Function, message)
  }

  static stream (value, { required = false, message = '' } = {}) {
    if (required) Assert.instanceOf(value, Stream, message)
    if (value !== undefined) Assert.instanceOf(value, Stream, message)
  }

  static uuid (value, { required = false, message = '' } = {}) {
    Assert.string(value, { required, message })
    if (!UUID_REGEXP.test(value)) Assert.fail(value, 'UUID', message)
  }

  static url (value, { required = false, message = '' } = {}) {
    Assert.string(value, { required, message })
    if (!URL_REGEXP.test(value)) Assert.fail(value, 'URL', message)
  }
}

module.exports = process.env.NODE_NOASSERT ? Object.getOwnPropertyNames(Assert).forEach(key => (Assert[key] = function noAssert () {})) : Assert
