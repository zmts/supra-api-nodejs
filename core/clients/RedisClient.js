const redis = require('redis')
const $ = Symbol('private scope')

class RedisClient {
  constructor (options = {}) {
    __typecheck(options.port, __type.number)
    __typecheck(options.host, __type.string)

    this[$] = {
      client: redis.createClient({
        port: options.port || 6379,
        host: options.host || 'localhost'
      })
    }

    this[$].client.on('error', error => {
      __logger.error('Error ', error)
    })

    this[$].client.on('connect', () => {
      __logger.info(`${this.constructor.name} connected...`)
    })
  }

  /**
   * ------------------------------
   * upload tokens (uuids)
   * upload tokens (uuids)
   * upload tokens (uuids)
   * ------------------------------
   */

  setUploadTokensList (listOfUuids, ttl = 15 * 60) { // ttl 15min
    __typecheck(listOfUuids, __type.array, true)
    __typecheck(ttl, __type.number)

    return new Promise((resolve, reject) => {
      listOfUuids.forEach(uuid => {
        this[$].client.set(`upload-token::${uuid}`, true, 'EX', ttl, (error, reply) => {
          if (error) return reject(error)
        })
      })

      resolve()
    })
  }

  isExistUploadToken (uuid) {
    __typecheck(uuid, __type.string, true)

    return new Promise((resolve, reject) => {
      this[$].client.get(`upload-token::${uuid}`, (error, reply) => {
        if (error) return reject(error)
        if (reply) return resolve(reply)
        return resolve(false)
      })
    })
  }

  removeUploadToken (uuid) {
    __typecheck(uuid, __type.string, true)

    return new Promise((resolve, reject) => {
      this[$].client.del(`upload-token::${uuid}`, (error, reply) => {
        if (error) return reject(error)
        return resolve()
      })
    })
  }

  /**
   * ------------------------------
   * uploads count
   * uploads count
   * uploads count
   * ------------------------------
   */

  getUserUploadsCount (userId) {
    __typecheck(userId, __type.string, true)

    return new Promise((resolve, reject) => {
      this[$].client.get(`user-uploads-count::${userId}`, (error, count) => {
        if (error) return reject(error)
        if (count) return resolve(Number(count))
        return resolve(0)
      })
    })
  }

  setUserUploadsCount (count, userId, ttl) {
    __typecheck(count, __type.number, true)
    __typecheck(userId, __type.string, true)
    __typecheck(ttl, __type.number, true)

    return new Promise((resolve, reject) => {
      this[$].client.set(`user-uploads-count::${userId}`, count, 'EX', ttl, (error, reply) => {
        if (error) return reject(error)
      })

      return resolve()
    })
  }

  getUserUploadsCountTtl (userId) {
    __typecheck(userId, __type.string, true)

    return new Promise((resolve, reject) => {
      this[$].client.ttl(`user-uploads-count::${userId}`, (error, sec) => {
        if (error) return reject(error)
        if (Number(sec) > 0) return resolve(Number(sec))
        return resolve(0)
      })
    })
  }

  incrUserUploadsCount (count, userId) {
    __typecheck(count, __type.number, true)
    __typecheck(userId, __type.string, true)

    return new Promise((resolve, reject) => {
      this[$].client.incrby(`user-uploads-count::${userId}`, count, (error, reply) => {
        if (error) return reject(error)
      })

      return resolve()
    })
  }
}

module.exports = RedisClient
