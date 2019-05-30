const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { Model } = require('objection')
const Knex = require('knex')

class Server {
  constructor ({ port, host, controllers, middlewares, errorMiddleware, knexConfig }) {
    __logger.info('Server start initialization...')
    return start({ port, host, controllers, middlewares, errorMiddleware, knexConfig })
  }
}

function start ({ port, host, controllers, middlewares, errorMiddleware, knexConfig }) {
  if (!Array.isArray(controllers)) {
    throw new Error('\'controllers\' param should be an array.')
  }
  if (!Array.isArray(middlewares)) {
    throw new Error('\'middlewares\' param should be an array.')
  }

  return new Promise(async (resolve, reject) => {
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
        app.use(middleware.handler())
      } catch (e) {
        return reject(e)
      }
    }

    /**
     * controllers initialization
     */
    for (const item of controllers) {
      try {
        await item.init()
        app.use(item.router)
      } catch (e) {
        return reject(e)
      }
    }

    /**
     * Database initialization
     */
    try {
      Model.knex(Knex(knexConfig))
    } catch (e) {
      return reject(`Database initialization failed. ${e}`)
    }

    /**
     * error handler
     */
    try {
      await errorMiddleware.init()
      app.use(errorMiddleware.handler())
    } catch (e) {
      return reject(`Default error middleware failed. ${e}`)
    }

    /**
     * Not found route handler
     */
    app.use((req, res) => {
      res.status(404).json({ message: 'Route not found' })
    })

    /**
     * unhandledRejection handler
     */
    process.on('unhandledRejection', (reason, promise) => {
      __logger.error('unhandledRejection', reason)
    })

    /**
     * rejectionHandled handler
     */
    process.on('rejectionHandled', promise => {
      __logger.warn('rejectionHandled', promise)
    })

    /**
     * multipleResolves handler
     */
    process.on('multipleResolves', (type, promise, reason) => {
      __logger.error('multipleResolves', { type, promise, reason })
    })

    /**
     * uncaughtException handler
     */
    process.on('uncaughtException', error => {
      __logger.fatal('uncaughtException', error.stack)
      process.exit(1)
    })

    return app.listen(port, host, () => resolve({ port, host }))
  })
}

module.exports = Server
