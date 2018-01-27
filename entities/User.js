class User {
  static setMapping (mapping) {
    mapping.autoFields()
    mapping.field('username', { type: 'string' })
    mapping.field('email', { type: 'string' })
  }
}

module.exports = User
