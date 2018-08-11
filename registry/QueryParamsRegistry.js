class QueryParamsRegistry {
  constructor () {
    this._params = {}
  }

  get () {
    return this._params
  }

  set (key, value) {
    __typecheck(key, 'String', true)
    __typecheck(value, '*', true)

    this._params[key] = value
  }

  list () {
    return this._params
  }
}

module.exports = QueryParamsRegistry
