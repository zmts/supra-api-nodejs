class BaseModel {
  constructor (src) {
    const schema = this.constructor.schema

    Object.keys(schema).forEach(propName => {
      const validator = schema[propName].validator
      const description = schema[propName].description
      const value = src[propName]

      if (typeof validator !== 'function') {
        throw new Error('validator should be a function.')
      }
      if (description === undefined) {
        throw new Error(`Schema field '${propName}' expect description.`)
      }
      if (!validator(value)) {
        throw new Error(`Invalid '${propName}'. Expect: ${description}`)
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
    const validator = schema[propName].validator
    const description = schema[propName].description

    if (typeof validator !== 'function') {
      throw new Error('Validator should be a function.')
    }
    if (description === undefined) {
      throw new Error(`Schema field '${propName}' expect description.`)
    }

    Object.defineProperty(context, propName, {
      get: () => src[propName],
      set: value => {
        if (!validator(value)) {
          throw new Error(`Invalid '${propName}'. Expect: ${description}`)
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
