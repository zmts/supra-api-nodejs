const joi = require('@hapi/joi')

class BaseModel {
  constructor (src = {}, { requiredFields = [], description = '' } = {}) {
    this.description = description || ''
    this.buildModel(src, this.schema)
  }

  static get joi () {
    return joi
  }

  buildModel (src, schema) {
    //
  }
}

module.exports = BaseModel
