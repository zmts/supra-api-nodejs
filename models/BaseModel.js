const Joi = require('joi')

class BaseModel {
  constructor (dataObj) {
    __typecheck(dataObj, __type.object, true)

    const validationResult = this.joi.validate(dataObj, this.schema)
    if (validationResult.error) { throw new Error(validationResult.error) }

    if (!this.isInitialized) {
      buildModelProps(dataObj, this.schema, this)
    }
  }

  get joi () {
    return Joi
  }

  get schema () {
    throw new Error('Missing schema')
  }
}

function buildModelProps (dataObj, schema, context) {
  __typecheck(dataObj, __type.object, true)
  __typecheck(schema, __type.object, true)
  __typecheck(context, __type.object, true)

  Object.keys(dataObj).forEach(propName => {
    Object.defineProperty(context, propName, {
      get: () => dataObj[propName],
      set: value => {
        const isValidValue = Joi.validate(value, schema[propName])
        if (isValidValue.error) { throw new Error(isValidValue.error) }
        dataObj[propName] = value
      },
      enumerable: true,
      configurable: false
    })
  })

  Object.defineProperty(context.__proto__, 'isInitialized', {
    get: () => true,
    configurable: false
  })

  return context
}

module.exports = BaseModel
