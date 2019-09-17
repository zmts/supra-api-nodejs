// const S3Client = require('../core/clients/S3Client')
// const RedisClient = require('../core/clients/RedisClient')
const { EmailClient } = require('supra-core').clients
const config = require('../config')
const logger = require('../util/logger')

class RootProvider {
  constructor () {
    // this.redisClient = new RedisClient()

    // this.s3Client = new S3Client({
    //   access: config.s3.access,
    //   secret: config.s3.secret,
    //   bucket: config.s3.bucket,
    //   logger
    // })

    this.emailClient = new EmailClient({
      apiKey: config.email.mailgunApiKey,
      domain: config.email.mailgunDomain,
      from: config.email.from,
      logger
    })
  }
  async init () {
    __logger.info(`${this.constructor.name} initialized...`)
  }
}

module.exports = new RootProvider()
