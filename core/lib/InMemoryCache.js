const LruCache = require('lru-cache')
const { Assert: assert } = require('./assert')

const $ = Symbol('private scope')

class InMemoryCache {
  constructor ({ maxAgeMs, maxItems }) {
    this[$] = {
      cache: new LruCache({
        maxAge: maxAgeMs,
        maxItems
      })
    }
  }

  get (key) {
    assert.string(key, { notEmpty: true })

    return this[$].cache.get(key) || null
  }

  set (key, data) {
    assert.string(key, { notEmpty: true })

    this[$].cache.set(key, data)
  }

  remove (key) {
    assert.string(key, { notEmpty: true })

    this[$].cache.del(key)
  }

  reset () {
    this[$].cache.reset()
  }
}

module.exports = { InMemoryCache }
