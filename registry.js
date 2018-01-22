class Registry {
  constructor () {
    this._registry = new Map()
  }

  get (value) {
    if (!value) throw new Error('get method required value param')

    return this._registry.get(value)
  }

  set (key, value) {
    if (!key || !value) throw new Error('set method required key and value params')

    this._registry.set(key, value)
  }

  list () {
    return this._registry
  }
}

module.exports = new Registry()
