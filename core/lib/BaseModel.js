const { AppError } = require('./AppError')
const errorCodes = require('./errorCodes')
const { Rule } = require('./Rule')

const genericSchema = {
  id: new Rule({
    validator: v => isInt(v),
    description: 'number; positive; greater than 1'
  }),
  createdAt: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 2 && v.length <= 50,
    description: 'string; date;'
  }),
  updatedAt: new Rule({
    validator: v => (typeof v === 'string') && v.length >= 2 && v.length <= 50,
    description: 'string; date;'
  })
}

class BaseModel {
  constructor (src) {
    const { schema } = this.constructor

    Object.keys(schema).forEach(propName => {
      const rule = schema[propName]
      if (!rule) return

      const { validator, description } = rule
      const value = src[propName]

      const validationResult = validator(value)
      if (typeof validationResult !== 'boolean') {
        throw new Error(`Invalid '${propName}' field validator. Please redefine it. Validator should return only boolean type.`)
      }

      if (!validationResult) {
        throw new AppError({ ...errorCodes.UNPROCESSABLE_ENTITY, message: `Invalid '${propName}' field. Expect: ${description}` })
      }
    })

    buildModelProps(src, this.constructor.schema, this)
  }

  static get schema () {
    throw new Error('Missing schema')
  }

  static get genericSchema () {
    return genericSchema
  }
}

function buildModelProps (src, schema, context) {
  Object.keys(src).forEach(propName => {
    const rule = schema[propName]
    if (!rule) return

    const { validator, description } = rule

    Object.defineProperty(context, propName, {
      get: () => src[propName],
      set: value => {
        if (!validator(value)) {
          throw new AppError({ ...errorCodes.UNPROCESSABLE_ENTITY, message: `Invalid '${propName}' field. Expect: ${description}` })
        }
        src[propName] = value
      },
      enumerable: true,
      configurable: false
    })
  })

  return Object.freeze(context)
}

function isInt (int) {
  const tmpInt = Number(int)
  return !!(tmpInt && Number.isInteger(tmpInt) && tmpInt >= 1)
}

module.exports = { BaseModel }
