const AWS = require('aws-sdk')
const { assert } = require('supra-core')
const logger = require('../logger')

const $ = Symbol('private scope')

class S3Client {
  constructor (options) {
    assert.object(options, { required: true })
    assert.string(options.access, { notEmpty: true })
    assert.string(options.secret, { notEmpty: true })
    assert.string(options.bucket, { notEmpty: true })

    AWS.config.update({
      accessKeyId: options.access,
      secretAccessKey: options.secret
    })

    this[$] = {
      client: new AWS.S3(),
      bucket: options.bucket
    }

    logger.trace(`${this.constructor.name} constructed...`)
  }

  async uploadImage (buffer, fileName) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error(`${this.constructor.name}: buffer param is not a Buffer type`)
    }
    assert.string(fileName, { notEmpty: true })

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this[$].bucket,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg'
      }

      this[$].client.upload(params, (error, data) => {
        if (error) {
          logger.error(`${this.constructor.name}: unable to upload objects`, error)
          return reject(error)
        }
        resolve(data.Location)
      })
    })
  }

  async batchRemove (keysArr) {
    assert.array(keysArr, { of: [String], notEmpty: true })

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this[$].bucket,
        Delete: {
          Objects: keysArr.map(fileKey => ({ Key: fileKey })),
          Quiet: false
        }
      }

      this[$].client.deleteObjects(params, (error, data) => {
        if (error) {
          logger.error(`${this.constructor.name}: unable to remove objects`, error)
          return reject(error)
        }

        resolve(data)
      })
    })
  }
}

module.exports = S3Client
