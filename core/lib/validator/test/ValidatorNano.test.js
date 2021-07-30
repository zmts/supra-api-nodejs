const { Writable } = require('stream')
const { expect } = require('chai')
const { ValidatorNano } = require('../ValidatorNano')

describe('ValidatorNano', function () {
  describe('ValidatorNano.isDefined', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isDefined('')).to.be.true
      expect(ValidatorNano.isDefined('hello')).to.be.true
      expect(ValidatorNano.isDefined(true)).to.be.true
      expect(ValidatorNano.isDefined(false)).to.be.true
      expect(ValidatorNano.isDefined(null)).to.be.true
      expect(ValidatorNano.isDefined(NaN)).to.be.true
      expect(ValidatorNano.isDefined(0)).to.be.true
      expect(ValidatorNano.isDefined({})).to.be.true
      expect(ValidatorNano.isDefined([])).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isDefined(undefined)).to.be.false
    })
  })

  describe('ValidatorNano.isInstanceOf', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isInstanceOf(new Date(), Date)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isInstanceOf('hello', Date)).to.be.false
    })
  })

  describe('ValidatorNano.isArray', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isArray([])).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isArray(undefined)).to.be.false
      expect(ValidatorNano.isArray({})).to.be.false
    })
  })

  describe('ValidatorNano.isArrayNotEmpty', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isArrayNotEmpty([1])).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isArrayNotEmpty([])).to.be.false
      expect(ValidatorNano.isArrayNotEmpty({})).to.be.false
      expect(ValidatorNano.isArrayNotEmpty(undefined)).to.be.false
    })
  })

  describe('ValidatorNano.isArrayOf', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isArrayOf([], [Number])).to.be.true
      expect(ValidatorNano.isArrayOf([{}], [Object])).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isArrayOf(undefined, [Object])).to.be.false
      expect(ValidatorNano.isArrayOf({}, [Object])).to.be.false
      expect(ValidatorNano.isArrayOf([1], [String])).to.be.false
    })
  })

  describe('ValidatorNano.isObject', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isObject({})).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isObject([])).to.be.false
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

  describe('ValidatorNano.isStringNumber', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isStringNumber('0')).to.be.true
      expect(ValidatorNano.isStringNumber('1')).to.be.true
      expect(ValidatorNano.isStringNumber('1.1')).to.be.true
      expect(ValidatorNano.isStringNumber('-1.1')).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isStringNumber([])).to.be.false
      expect(ValidatorNano.isStringNumber({})).to.be.false
      expect(ValidatorNano.isStringNumber(NaN)).to.be.false
      expect(ValidatorNano.isStringNumber(1.1)).to.be.false
      expect(ValidatorNano.isStringNumber(-1.1)).to.be.false
    })
  })

  describe('ValidatorNano.isInt', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isInt(0)).to.be.true
      expect(ValidatorNano.isInt(1)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isInt([])).to.be.false
      expect(ValidatorNano.isInt(NaN)).to.be.false
      expect(ValidatorNano.isInt('10')).to.be.false
      expect(ValidatorNano.isInt('10.1')).to.be.false
      expect(ValidatorNano.isInt(1.1)).to.be.false
      expect(ValidatorNano.isInt(-1.1)).to.be.false
    })
  })

  describe('ValidatorNano.isUint', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isUint(0)).to.be.true
      expect(ValidatorNano.isUint(1)).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isUint([])).to.be.false
      expect(ValidatorNano.isUint(NaN)).to.be.false
      expect(ValidatorNano.isUint('-10')).to.be.false
      expect(ValidatorNano.isUint('10')).to.be.false
      expect(ValidatorNano.isUint('10.1')).to.be.false
      expect(ValidatorNano.isUint(-10)).to.be.false
      expect(ValidatorNano.isUint(1.1)).to.be.false
      expect(ValidatorNano.isUint(-1.1)).to.be.false
    })
  })

  describe('ValidatorNano.isStringInt', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isStringInt('0')).to.be.true
      expect(ValidatorNano.isStringInt('1')).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isStringInt([])).to.be.false
      expect(ValidatorNano.isStringInt({})).to.be.false
      expect(ValidatorNano.isStringInt(NaN)).to.be.false
      expect(ValidatorNano.isStringInt('10.1')).to.be.false
      expect(ValidatorNano.isStringInt(1.1)).to.be.false
      expect(ValidatorNano.isStringInt(-1.1)).to.be.false
    })
  })

  describe('ValidatorNano.isString', () => {
    it('it should return true', () => {
      expect(ValidatorNano.isString('hello')).to.be.true
    })
    it('it should return false', () => {
      expect(ValidatorNano.isString(100)).to.be.false
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
