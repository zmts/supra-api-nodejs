const ErrorWrapper = require('./ErrorWrapper')
const errorCodes = require('./errorCodes')

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
        throw new ErrorWrapper({ ...errorCodes.UNPROCESSABLE_ENTITY, message: `Invalid '${propName}' field. Expect: ${description}` })
      }
    })

    buildModelProps(src, this.constructor.schema, this)
  }

  static get schema () {
    throw new Error('Missing schema')
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
          throw new ErrorWrapper({ ...errorCodes.UNPROCESSABLE_ENTITY, message: `Invalid '${propName}' field. Expect: ${description}` })
        }
        src[propName] = value
      },
      enumerable: true,
      configurable: false
    })
  })

  return Object.freeze(context)
}

module.exports = BaseModel
