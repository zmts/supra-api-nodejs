const fs = require('fs')
const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const logger = require('../../../logger')

class UploadFileAction extends BaseAction {
  static get accessTag () {
    return 'posts:upload-file'
  }

  static async run (ctx) {
    const { fields, files } = ctx.formData

    for (const file in files) {
      await new Promise((resolve, reject) => {
        const fileStream = files[file].stream
        const fileName = files[file].filename
        const fileSize = files[file].size // TODO: research why it works and it accessible with proper value ?

        fileStream.pipe(fs.createWriteStream(fileName))
        fileStream.on('end', () => {
          logger.info(`${fileName} file processed`)
          resolve()
        })
        fileStream.on('error', error => reject(error))
      })
    }

    const message = `${files.length} files processed`
    logger.info(message)

    return this.result({ data: message })
  }
}

module.exports = { UploadFileAction }
