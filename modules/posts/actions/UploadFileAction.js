const fs = require('fs')
const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const logger = require('../../../logger')

class UploadFileAction extends BaseAction {
  static get accessTag () {
    return 'posts:upload-file'
  }

  static async run (ctx) {
    let filesCount = 0

    const { fields } = await ctx.formData(file => { // TODO: works unclear. Should take mush less memory, refact it
      filesCount++

      const fileStream = file.stream
      const fileName = file.filename

      fileStream.pipe(fs.createWriteStream(fileName))
      fileStream.on('end', () => {
        logger.info(`${fileName} file processed`)
        fileStream.end()
      })
      fileStream.on('error', error => {
        console.log(error)
      })
    })

    return this.result({ data: { filesCount, fields } })
  }
}

module.exports = { UploadFileAction }
