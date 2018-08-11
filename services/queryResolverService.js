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

      registry.queryParams.set(key, { field, direction })
    } else {
      registry.queryParams.set(key, config[key])
    }
  })

  console.log('queryResolverService >> registry.currentUser list', registry.currentUser.list())
  console.log('queryResolverService >> registry.queryParams list', registry.queryParams.list())
}
