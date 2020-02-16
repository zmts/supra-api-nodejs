const { InitMiddleware } = require('./InitMiddleware')
const { CorsMiddleware } = require('./CorsMiddleware')
const { CheckAccessTokenMiddleware } = require('./CheckAccessTokenMiddleware')
const { SanitizeMiddleware } = require('./SanitizeMiddleware')
const { QueryMiddleware } = require('./QueryMiddleware')
const { ContentTypeMiddleware } = require('./ContentTypeMiddleware')

module.exports = [
  InitMiddleware,
  CorsMiddleware,
  CheckAccessTokenMiddleware,
  SanitizeMiddleware,
  QueryMiddleware,
  ContentTypeMiddleware
]
