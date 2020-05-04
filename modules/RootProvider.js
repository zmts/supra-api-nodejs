const { EmailAgent, S3Agent, RedisAgent } = require('../agents')
const config = require('../config')
const logger = require('../logger')

class RootProvider {
  constructor () {
    // this.redisClient = new RedisAgent()

    // this.s3Agent = new S3Agent({
    //   access: config.s3.access,
    //   secret: config.s3.secret,
    //   bucket: config.s3.bucket,
    //   logger
    // })

    this.emailAgent = new EmailAgent({
      apiKey: config.email.mailgunApiKey,
      domain: config.email.mailgunDomain,
      host: config.email.mailgunHost,
      from: config.email.from,
      logger
    })
  }
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }
}

module.exports = new RootProvider()
