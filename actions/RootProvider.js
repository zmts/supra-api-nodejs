const S3Client = require('../core/clients/S3Client')
const RedisClient = require('../core/clients/RedisClient')
const config = require('../config')

class RootProvider {
  constructor () {
    this.s3Client = new S3Client({
      access: config.s3.access,
      secret: config.s3.secret,
      bucket: config.s3.bucket
    })
    this.redisClient = new RedisClient()
  }
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }
}

module.exports = new RootProvider()
