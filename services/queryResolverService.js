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
    if (key === 'orderBy') {
      let field = config[key].split(':')[0]
      let direction = config[key].split(':')[1]

      registry.set(key, { field, direction })
    } else {
      registry.set(key, config[key])
    }
  })

  console.log('queryResolverService >> registry list', registry.list())
}
