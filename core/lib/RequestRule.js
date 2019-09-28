const assert = require('./assert')
const Rule = require('./Rule')

/**
 * schemaRule - Rule instance class
 * options.required - is required flag
 * options.allowed - allowed values (like null or empty string)
 */
class RequestRule {
  constructor (schemaRule, { required = false, allowed = [] } = {}) {
    assert.instanceOf(schemaRule, Rule)
    assert.object(arguments[1])
    assert.boolean(required)
    assert.array(allowed)

    this.schemaRule = schemaRule
    this.options = {
      ...(required ? { required: true } : { required: false }),
      ...(allowed ? { allowed: allowed } : { allowed: [] })
    }
  }
}

module.exports = RequestRule
