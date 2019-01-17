const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { Model } = require('objection')
const Knex = require('knex')

class Server {
  constructor ({ port, host, routers, middlewares, errorMiddleware, knexConfig }) {
    __logger.info('Server start initialization...')
    return start({ port, host, routers, middlewares, errorMiddleware, knexConfig })
  }
}

async function start ({ port, host, routers, middlewares, errorMiddleware, knexConfig }) {
  if (!Array.isArray(routers)) {
    throw new Error('\'routers\' param should be an array of express routers.')
  }
  if (!Array.isArray(middlewares)) {
    throw new Error('\'middlewares\' param should be an array.')
  }

  const app = express()

  // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  if (process.env.NODE_ENV !== 'production') app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  // use static/public folder
  app.use(express.static(path.join(__dirname, 'public')))

  /**
   * middlewares initialization
   */
  for (const middleware of middlewares) {
    try {
      await middleware.init()
    } catch (e) {
      throw new Error(`Middleware initialization failed. ${e}`)
    }
    app.use(middleware.handler())
  }

  /**
   * routers initialization
   */
  for (const item of routers) {
    try {
      await item.init()
    } catch (e) {
      throw new Error(`Router initialization failed. ${e}`)
    }
    app.use(item.router)
  }

  /**
   * Database initialization
   */
  try {
    Model.knex(Knex(knexConfig))
  } catch (e) {
    throw new Error(`Database initialization failed. ${e}`)
  }

  /**
   * error handler
   */
  try {
    await errorMiddleware.init()
  } catch (e) {
    throw new Error(`Default error middleware initialization failed. ${e}`)
  }
  app.use(errorMiddleware.handler())

  /**
   * Not found route handler
   */
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
  })

  /**
   * uncaughtException handler
   */
  process.on('uncaughtException', error => {
    __logger.fatal('uncaughtException', error.stack)
    process.exit(1)
  })

  return new Promise((resolve) => {
    return app.listen(port, host, () => resolve({ port, host }))
  })
}

module.exports = Server
