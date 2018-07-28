const swaggerJSDoc = require('swagger-jsdoc')

let swaggerDefinition = {
  info: {
    title: 'Supra API Docs',
    version: '1.0.0'
  },
  host: 'localhost:4000',
  basePath: '/'
}

module.exports = swaggerJSDoc({
  swaggerDefinition: swaggerDefinition,
  apis: ['./controllers/*.js']
})
