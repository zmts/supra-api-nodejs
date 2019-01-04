const config = require('../config')

module.exports = async (req, res, next) => {
  res.header('Server', config.app.name)
  next()
}
