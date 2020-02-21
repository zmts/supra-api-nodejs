const { Writable } = require('stream')
const { expect } = require('chai')
const { ValidatorNano } = require('../ValidatorNano')

describe('ValidatorNano', function () {
  describe('ValidatorNano.isInstanceOf', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isInstanceOf(new Date(), Date)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isInstanceOf('hello', Date)).to.be.false
    })
  })

  describe('ValidatorNano.isTypeOf', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isTypeOf(1, Number)).to.be.true
      expect(ValidatorNano.isTypeOf('hello', String)).to.be.true
      expect(ValidatorNano.isTypeOf({}, Object)).to.be.true
      expect(ValidatorNano.isTypeOf([], Array)).to.be.true
      expect(ValidatorNano.isTypeOf(true, Boolean)).to.be.true
      expect(ValidatorNano.isTypeOf(() => {}, Function)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isTypeOf('hello', Number)).to.be.false
      expect(ValidatorNano.isTypeOf(NaN, Number)).to.be.false
      expect(ValidatorNano.isTypeOf(1000, String)).to.be.false
      expect(ValidatorNano.isTypeOf([], Object)).to.be.false
      expect(ValidatorNano.isTypeOf({}, Array)).to.be.false
      expect(ValidatorNano.isTypeOf('hello', Boolean)).to.be.false
      expect(ValidatorNano.isTypeOf('hello', Function)).to.be.false
    })
  })

  describe('ValidatorNano.isArray', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isArray([])).to.be.true
      expect(ValidatorNano.isArray([1], { notEmpty: true })).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isArray(undefined)).to.be.false
      expect(ValidatorNano.isArray({})).to.be.false
      expect(ValidatorNano.isArray([], { notEmpty: true })).to.be.false
    })
  })

  describe('ValidatorNano.isArrayOf', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isArrayOf([], [Number])).to.be.true
      expect(ValidatorNano.isArrayOf([1], [Number], { notEmpty: true })).to.be.true
      expect(ValidatorNano.isArrayOf([{}], [Object])).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isArrayOf(undefined, [Object])).to.be.false
      expect(ValidatorNano.isArrayOf({}, [Object])).to.be.false
      expect(ValidatorNano.isArrayOf([], [Object], { notEmpty: true })).to.be.false
      expect(ValidatorNano.isArrayOf([1], [String])).to.be.false
    })
  })

  describe('ValidatorNano.isObject', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isObject({})).to.be.true
      expect(ValidatorNano.isObject({ hello: 'hello' }, { notEmpty: true })).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isObject([])).to.be.false
      expect(ValidatorNano.isObject({}, { notEmpty: true })).to.be.false
    })
  })

  describe('ValidatorNano.isNumber', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isNumber(0)).to.be.true
      expect(ValidatorNano.isNumber(1)).to.be.true
      expect(ValidatorNano.isNumber(1.1)).to.be.true
      expect(ValidatorNano.isNumber(-1)).to.be.true
      expect(ValidatorNano.isNumber(-1.1)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isNumber('1')).to.be.false
      expect(ValidatorNano.isNumber([])).to.be.false
      expect(ValidatorNano.isNumber(NaN)).to.be.false
    })
  })

  describe('ValidatorNano.isInteger', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isInteger(0)).to.be.true
      expect(ValidatorNano.isInteger(1)).to.be.true
      expect(ValidatorNano.isInteger(1)).to.be.true
      expect(ValidatorNano.isInteger(100, { min: 10 })).to.be.true
      expect(ValidatorNano.isInteger(1, { max: 10 })).to.be.true
      expect(ValidatorNano.isInteger(7, { min: 5, max: 10 })).to.be.true
      expect(ValidatorNano.isInteger(5, { min: 5, max: 10 })).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isInteger([])).to.be.false
      expect(ValidatorNano.isInteger(NaN)).to.be.false
      expect(ValidatorNano.isInteger('10')).to.be.false
      expect(ValidatorNano.isInteger('10.1')).to.be.false
      expect(ValidatorNano.isInteger(1.1)).to.be.false
      expect(ValidatorNano.isInteger(-1.1)).to.be.false
      expect(ValidatorNano.isInteger(1, { min: 10 })).to.be.false
      expect(ValidatorNano.isInteger(100, { max: 10 })).to.be.false
      expect(ValidatorNano.isInteger(1, { min: 5, max: 10 })).to.be.false
      expect(ValidatorNano.isInteger(100, { min: 5, max: 10 })).to.be.false

      try {
        ValidatorNano.isInteger(100, { min: '5', max: 10 })
      } catch (e) {
        expect(e.message).to.equal('Invalid min param. Should be a number')
      }

      try {
        ValidatorNano.isInteger(100, { min: 5, max: '10' })
      } catch (e) {
        expect(e.message).to.equal('Invalid max param. Should be a number')
      }
    })
  })

  describe('ValidatorNano.isString', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isString('hello')).to.be.true
      expect(ValidatorNano.isString('hello', { notEmpty: true })).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isString(100)).to.be.false
      expect(ValidatorNano.isString('', { notEmpty: true })).to.be.false
    })
  })

  describe('ValidatorNano.isBoolean', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isBoolean(true)).to.be.true
      expect(ValidatorNano.isBoolean(false)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isString(100)).to.be.false
    })
  })

  describe('ValidatorNano.isBuffer', () => {
    const buffer = Buffer.from([1, 2, 3])
    const emptyBuffer = Buffer.from('')

    it('it should return true', () => {
      expect(ValidatorNano.isBuffer(buffer)).to.be.true
      expect(ValidatorNano.isBuffer(emptyBuffer)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isBuffer(100)).to.be.false
      expect(ValidatorNano.isBuffer(emptyBuffer, { notEmpty: true })).to.be.false
    })
  })

  describe('ValidatorNano.isDate', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isDate(new Date())).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isDate(100)).to.be.false
    })
  })

  describe('ValidatorNano.isFunc', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isFunc(() => {})).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isFunc(100)).to.be.false
    })
  })

  describe('ValidatorNano.isStream', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isStream(new Writable())).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isStream(100)).to.be.false
    })
  })

  describe('ValidatorNano.isId', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isId(100)).to.be.true
      expect(ValidatorNano.isId('100')).to.be.true
      expect(ValidatorNano.isId('58fd9f49-825e-4f20-880d-496795560dfb')).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isId(0)).to.be.false
      expect(ValidatorNano.isId(-100)).to.be.false
      expect(ValidatorNano.isId(100.1)).to.be.false
      expect(ValidatorNano.isId('100.1')).to.be.false
    })
  })

  describe('ValidatorNano.isUuid', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isUuid('58fd9f49-825e-4f20-880d-496795560dfb')).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isUuid(NaN)).to.be.false
      expect(ValidatorNano.isUuid({})).to.be.false
      expect(ValidatorNano.isUuid(-100)).to.be.false
      expect(ValidatorNano.isUuid(100.1)).to.be.false
      expect(ValidatorNano.isUuid('100.1')).to.be.false
      expect(ValidatorNano.isUuid('58fd9f49-825e-4f20-880d')).to.be.false
    })
  })

  describe('ValidatorNano.isUrl', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isUrl('http://google.com/')).to.be.true
      expect(ValidatorNano.isUrl('http://go')).to.be.true
      expect(ValidatorNano.isUrl('http://localhost')).to.be.true
      expect(ValidatorNano.isUrl('http://192.168.0.1')).to.be.true
      expect(ValidatorNano.isUrl('https://google.com/')).to.be.true
      expect(ValidatorNano.isUrl('ftp://google.com/')).to.be.true
      expect(ValidatorNano.isUrl('ftps://google.com/')).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isUrl({})).to.be.false
      expect(ValidatorNano.isUrl('')).to.be.false
      expect(ValidatorNano.isUrl('h')).to.be.false
      expect(ValidatorNano.isUrl('https')).to.be.false
      expect(ValidatorNano.isUrl('https://')).to.be.false
    })
  })

  describe('ValidatorNano.isIP', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isIP('128.0.0.1')).to.be.true
      expect(ValidatorNano.isIP('192.168.1.1')).to.be.true
      expect(ValidatorNano.isIP('192.168.1.255')).to.be.true
      expect(ValidatorNano.isIP('255.255.255.255')).to.be.true
      expect(ValidatorNano.isIP('0.0.0.0')).to.be.true
      expect(ValidatorNano.isIP('1.1.1.01')).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isIP('https://192.168.1.255')).to.be.false
      expect(ValidatorNano.isIP('192.168.1.256')).to.be.false
      expect(ValidatorNano.isIP('255.255.255.256')).to.be.false
      expect(ValidatorNano.isIP('0.0.0.256')).to.be.false
    })
  })
})
