const registry = require('./../registry')

/**
  * set entity query props from entityQueryConfig to registry
  */
module.exports = config => { // TODO
  __typecheck(config, 'Object', true)

  Object.keys(config).forEach(key => {
    registry.set(key, config[key])
  })
}
