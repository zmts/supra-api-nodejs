const assert = require('./assert')
const Rule = require('./Rule')

class RequestRule {
  constructor (schemaRule, isRequired) {
    assert.instanceOf(schemaRule, Rule)
    assert.boolean(isRequired)

    this.schemaRule = schemaRule
    this.required = isRequired || false
  }
}

module.exports = RequestRule
