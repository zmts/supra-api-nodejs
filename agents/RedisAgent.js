const redis = require('redis')
const { assert, AbstractLogger, AppError, errorCodes } = require('supra-core')
const $ = Symbol('private scope')

class RedisAgent {
  constructor (options = {}) {
    assert.integer(options.port)
    assert.string(options.host)
    assert.instanceOf(options.logger, AbstractLogger)

    this[$] = {
      client: redis.createClient({
        port: options.port || 6379,
        host: options.host || 'localhost'
      })
    }

    this[$].client.on('error', error => {
      throw new Error(`${this.constructor.name}, ${error}`)
    })

    this[$].client.on('connect', () => {
      this[$].logger.debug(`${this.constructor.name} connected...`)
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
    assert.array(listOfUuids, { required: true })
    assert.integer(ttl)

    return new Promise((resolve, reject) => {
      listOfUuids.forEach(uuid => {
        this[$].client.set(`upload-token::${uuid}`, true, 'EX', ttl, (error, reply) => {
          if (error) {
            return reject(new AppError({
              ...errorCodes.EXTERNAL,
              message: `${this.constructor.name}: ${error.message}`,
              origin: error
            }))
          }
        })
      })

      resolve()
    })
  }

  isExistUploadToken (uuid) {
    assert.uuid(uuid, { required: true })

    return new Promise((resolve, reject) => {
      this[$].client.get(`upload-token::${uuid}`, (error, reply) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: ${error.message}`,
            origin: error
          }))
        }
        if (reply) return resolve(reply)
        return resolve(false)
      })
    })
  }

  removeUploadToken (uuid) {
    assert.uuid(uuid, { required: true })

    return new Promise((resolve, reject) => {
      this[$].client.del(`upload-token::${uuid}`, (error, reply) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: ${error.message}`,
            origin: error
          }))
        }
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
    assert.uuid(userId, { required: true })

    return new Promise((resolve, reject) => {
      this[$].client.get(`user-uploads-count::${userId}`, (error, count) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: ${error.message}`,
            origin: error
          }))
        }
        if (count) return resolve(Number(count))
        return resolve(0)
      })
    })
  }

  setUserUploadsCount (count, userId, ttl) {
    assert.integer(count, { required: true })
    assert.uuid(userId, { required: true })
    assert.integer(ttl, { required: true })

    return new Promise((resolve, reject) => {
      this[$].client.set(`user-uploads-count::${userId}`, count, 'EX', ttl, (error, reply) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: ${error.message}`,
            origin: error
          }))
        }
      })

      return resolve()
    })
  }

  getUserUploadsCountTtl (userId) {
    assert.uuid(userId, { required: true })

    return new Promise((resolve, reject) => {
      this[$].client.ttl(`user-uploads-count::${userId}`, (error, sec) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: ${error.message}`,
            origin: error
          }))
        }
        if (Number(sec) > 0) return resolve(Number(sec))
        return resolve(0)
      })
    })
  }

  incrUserUploadsCount (count, userId) {
    assert.integer(count, { required: true })
    assert.uuid(userId, { required: true })

    return new Promise((resolve, reject) => {
      this[$].client.incrby(`user-uploads-count::${userId}`, count, (error, reply) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: ${error.message}`,
            origin: error
          }))
        }
      })

      return resolve()
    })
  }
}

module.exports = { RedisAgent }
