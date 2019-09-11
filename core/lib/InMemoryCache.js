const NodeCache = require('node-cache')
const assert = require('./assert')

const $ = Symbol('private scope')

class InMemoryCache {
  constructor (ttlSeconds) {
    this[$] = {
      cache: new NodeCache({
        stdTTL: ttlSeconds,
        checkperiod: ttlSeconds * 0.2,
        useClones: false
      })
    }
  }

  get (key) {
    assert.string(key, { notEmpty: true })

    const value = this[$].cache.get(key)
    if (value) return value
    return null
  }

  set (key, data) {
    assert.string(key, { notEmpty: true })

    this[$].cache.set(key, data)
  }

  remove (key) {
    assert.string(key, { notEmpty: true })

    this[$].cache.del(key)
  }

  flush () {
    this[$].cache.flushAll()
  }
}

module.exports = InMemoryCache
