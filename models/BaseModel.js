const joi = require('joi')
const joiToJsonSchema = require('joi-to-json-schema')

class BaseModel {
  constructor (dataObj) {
    __typecheck(dataObj, __type.object, true)

    /**
     * if front-end needs model schema break model initialization and return schema json
     */
    if (dataObj.isSchema) return Object.freeze(this.schemaToJson)

    const validationResult = this.joi.validate(dataObj, this.schema)
    if (!validationResult.error) {
      this.buildModelProps(dataObj, this.schema, this)
    } else {
      throw new Error(validationResult.error)
    }
  }

  get joi () {
    return joi
  }

  get schema () {
    throw new Error('Missing schema')
  }

  get schemaToJson () {
    return joiToJsonSchema(this.joi.object({ ...this.schema }))
  }

  buildModelProps (dataObj, schema, context) {
    __typecheck(dataObj, __type.object, true)
    __typecheck(schema, __type.object, true)
    __typecheck(context, __type.object, true)

    Object.keys(dataObj).forEach(propName => {
      Object.defineProperty(context, propName, {
        get: () => dataObj[propName],
        set: value => {
          const isValidValue = this.joi.validate(value, schema[propName])
          if (!isValidValue.error) {
            dataObj[propName] = value
          } else {
            throw new Error(isValidValue.error)
          }
        },
        enumerable: true,
        configurable: false
      })
    })
    return Object.freeze(context)
  }
}

module.exports = BaseModel
