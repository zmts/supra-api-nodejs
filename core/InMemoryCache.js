import NodeCache from 'node-cache'

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
    __typecheck(key, __type.string, true)

    const value = this[$].cache.get(key)
    if (value) return value
    return null
  }

  set (key, data) {
    __typecheck(key, __type.string, true)

    this[$].cache.set(key, data)
  }

  remove (key) {
    __typecheck(key, __type.string, true)

    this[$].cache.del(key)
  }

  flush () {
    this[$].cache.flushAll()
  }
}

module.exports = InMemoryCache
