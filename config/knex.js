module.exports = {
  dev: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'zandr',
      password: '',
      database: 'supra_db',
      charset: 'utf8'
    },
    pool: {
      min: 1,
      max: 10
    }
    // debug: true
  },
  prod: {
    //
  }
}
