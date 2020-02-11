const AWS = require('aws-sdk')
const { assert, AbstractLogger, AppError, errorCodes } = require('supra-core')

const $ = Symbol('private scope')

class S3Agent {
  constructor (options) {
    assert.object(options, { required: true })
    assert.string(options.access, { notEmpty: true })
    assert.string(options.secret, { notEmpty: true })
    assert.string(options.bucket, { notEmpty: true })
    assert.instanceOf(options.logger, AbstractLogger)

    AWS.config.update({
      accessKeyId: options.access,
      secretAccessKey: options.secret
    })

    this[$] = {
      client: new AWS.S3(),
      bucket: options.bucket,
      logger: options.logger
    }

    this[$].logger.debug(`${this.constructor.name} constructed...`)
  }

  async uploadFile ({ buffer, fileName, mimetype = 'application/octet-stream' } = {}) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error(`${this.constructor.name}: buffer param is not a Buffer type`)
    }
    assert.string(fileName, { notEmpty: true })
    assert.string(mimetype, { notEmpty: true })

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this[$].bucket,
        Key: fileName,
        Body: buffer,
        ContentType: mimetype
      }

      this[$].client.upload(params, (error, data) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: unable to upload object. ${error.message}`,
            origin: error
          }))
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
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: unable to remove objects. ${error.message}`,
            origin: error
          }))
        }

        resolve(data)
      })
    })
  }

  /**
   * Get file as stream from S3
   * Use it for pipe stream directly into response
   */
  getFileAsStream (fileName) {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: this[$].bucket,
        Key: fileName
      }
      let head

      try {
        head = await this.headObject(fileName)
      } catch (e) {
        return reject(e)
      }

      const stream = this[$].client.getObject(params).createReadStream()

      stream.on('error', error => {
        return reject(new AppError({
          ...errorCodes.EXTERNAL,
          message: `${this.constructor.name}: error downloading file. ${error.message}`,
          origin: error
        }))
      })

      return resolve({
        mimetype: head.ContentType ? head.ContentType : 'application/octet-stream',
        stream
      })
    })
  }

  /**
   * Get metadata from an object without returning the object itself
   */
  headFile (fileName) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this[$].bucket,
        Key: fileName
      }

      this[$].client.headObject(params, (error, data) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: error getting file head. ${error.message}`,
            origin: error
          }))
        }

        return resolve(data)
      })
    })
  }
}

module.exports = { S3Agent }
