const { BaseDbDto } = require('./BaseDbDto')

class PostDbDto extends BaseDbDto {
  constructor (src = {}) {
    super(src)

    this.title = src.title
    this.content = src.content
  }
}

module.exports = { PostDbDto }
