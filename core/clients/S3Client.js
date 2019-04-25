const AWS = require('aws-sdk')
const $ = Symbol('private scope')

class S3Client {
  constructor (options) {
    __typecheck(options, __type.object, true)
    __typecheck(options.access, __type.string, true)
    __typecheck(options.secret, __type.string, true)
    __typecheck(options.bucket, __type.string, true)

    AWS.config.update({
      accessKeyId: options.access,
      secretAccessKey: options.secret
    })

    this[$] = {
      client: new AWS.S3(),
      bucket: options.bucket
    }

    __logger.info(`${this.constructor.name} constructed...`)
  }

  async uploadImage (buffer, fileName) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('buffer param is not a Buffer type')
    }
    __typecheck(fileName, __type.string, true)

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this[$].bucket,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/jpeg'
      }

      this[$].client.upload(params, (error, data) => {
        if (error) {
          __logger.error('s3Client: unable to upload objects ', error)
          return reject(error)
        }
        resolve(data.Location)
      })
    })
  }

  async batchRemove (keysArr) {
    __typecheck(keysArr, __type.arrayOfStrings, true)

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
          __logger.error('s3Client: unable to remove objects ', error)
          return reject(error)
        }

        resolve(data)
      })
    })
  }
}

module.exports = S3Client
