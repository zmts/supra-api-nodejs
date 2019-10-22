const { EmailClient, S3Client, RedisClient } = require('../clients')
const config = require('../config')
const logger = require('../logger')

class RootProvider {
  constructor () {
    // this.redisClient = new RedisClient()

    // this.s3Client = new S3Client({
    //   access: config.s3.access,
    //   secret: config.s3.secret,
    //   bucket: config.s3.bucket
    // })

    this.emailClient = new EmailClient({
      apiKey: config.email.mailgunApiKey,
      domain: config.email.mailgunDomain,
      host: config.email.mailgunHost,
      from: config.email.from
    })
  }
  async init () {
    logger.trace(`${this.constructor.name} initialized...`)
  }
}

module.exports = new RootProvider()
