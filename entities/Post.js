class Post {
  static setMapping (mapping) {
    mapping.autoFields()
    mapping.field('title', { type: 'string' })
    mapping.field('content', { type: 'string' })
  }
}

module.exports = Post
