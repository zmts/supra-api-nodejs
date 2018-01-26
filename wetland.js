const path = require('path')
const Wetland = require('wetland').Wetland

const wetland = new Wetland({
  debug: true,
  entityPath: `${path.resolve()}/entities`,
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
})

module.exports = wetland
