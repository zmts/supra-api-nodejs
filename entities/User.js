class User {
  static setMapping (mapping) {
    mapping.autoFields()
    mapping.field('username', { type: 'string' })
  }
}

module.exports = User
