const { Assert: assert } = require('./assert')

class Abstract {
  __abstractField (ctx, fieldName) {
    assert.object(ctx, { required: true })
    assert.string(fieldName, { notEmpty: true })

    if (!ctx[fieldName]) {
      throw new Error(`${ctx.constructor.name}: ${fieldName} field not implemented`)
    }
  }

  __abstractMethod (ctx, methodName, argsQuantity) {
    assert.object(ctx, { required: true })
    assert.string(methodName, { notEmpty: true })
    assert.integer(argsQuantity, { required: true, min: 1 })

    if (!ctx[methodName]) {
      throw new Error(`${ctx.constructor.name}: ${methodName} method not implemented`)
    }

    if (ctx[methodName].length !== argsQuantity) {
      throw new Error(`${ctx.constructor.name}: ${methodName} method invalid arguments length`)
    }
  }
}

module.exports = { Abstract }
