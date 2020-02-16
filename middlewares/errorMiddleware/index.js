const { DevErrorMiddleware } = require('./DevErrorMiddleware')
const { ProdErrorMiddleware } = require('./ProdErrorMiddleware')

module.exports = process.env.NODE_ENV !== 'production' ? DevErrorMiddleware : ProdErrorMiddleware
