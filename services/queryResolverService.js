const registry = require('./../registry')

/**
  * @description set query props to registry from req.query if prop exist in request or set it to defaults if not
  */
module.exports = (reqQuery, defaultConfig) => {
  __typecheck(reqQuery, 'Object', true)
  __typecheck(defaultConfig, 'Object', true)

  let config = {
    ...defaultConfig,
    ...reqQuery
  }

  Object.keys(config).forEach(key => {
    registry.set(key, config[key])
  })
}
