const Joi = require('joi')
const JoiToJsonSchema = require('joi-to-json-schema')

class BaseModel {
  constructor (dataObj) {
    /**
     * if no input data break model initialization and return schema json
     */
    if (!dataObj) return this.schemaToJson

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

  get schemaToJson () {
    return JoiToJsonSchema(this.joi.object({ ...this.schema }))
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
