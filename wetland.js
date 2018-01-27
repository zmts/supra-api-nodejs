const path = require('path')

module.exports = {
  debug: true,
  entityPath: path.resolve(process.cwd(), 'entities'),
  mapping: {
    defaultNamesToUnderscore: true
  },
  stores: {
    defaultStore: {
      client: 'pg',
      connection: {
        host: 'localhost',
        user: 'zandr',
        password: '',
        database: 'wetland_test_db'
      }
    }
  }
}
