const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const morganLogger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const assert = require('./assert')
const BaseMiddleware = require('./BaseMiddleware')
const Logger = require('./Logger')

class Server {
  constructor ({ port, host, controllers, middlewares, errorMiddleware, logger }) {
    assert.integer(port, { required: true, positive: true })
    assert.string(host, { required: true, notEmpty: true })
    assert.array(controllers, { required: true, notEmpty: true, message: 'controllers param expects not empty array' })
    assert.array(middlewares, { required: true, notEmpty: true, message: 'middlewares param expects not empty array' })
    assert.instanceOf(errorMiddleware, BaseMiddleware)
    assert.instanceOf(logger, Logger)

    logger.info('Server start initialization...')
    return start({ port, host, controllers, middlewares, errorMiddleware, logger })
  }
}

function start ({ port, host, controllers, middlewares, errorMiddleware, logger }) {
  return new Promise(async (resolve, reject) => {
    const app = express()

    // uncomment after placing your favicon in /public
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    if (process.env.NODE_ENV !== 'production') app.use(morganLogger('dev'))
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
        assert.func(item.init, { required: true })
        assert.func(item.router, { required: true })

        await item.init()
        app.use(item.router)
      } catch (e) {
        return reject(e)
      }
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
      res.status(404).json({
        message: `Route: '${req.url}' not found`,
        code: 'ROUTE_NOT_FOUND_ERROR'
      })
    })

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('unhandledRejection', reason)
    })

    process.on('rejectionHandled', promise => {
      logger.warn('rejectionHandled', promise)
    })

    process.on('multipleResolves', (type, promise, reason) => {
      logger.error('multipleResolves', { type, promise, reason })
    })

    process.on('uncaughtException', error => {
      logger.fatal('uncaughtException', error.stack)
      process.exit(1)
    })

    return app.listen(port, host, () => resolve({ port, host }))
  })
}

module.exports = Server
