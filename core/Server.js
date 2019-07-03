const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

class Server {
  constructor ({ port, host, controllers, middlewares, errorMiddleware }) {
    __typecheck(port, __type.number, true)
    __typecheck(host, __type.string, true)
    __typecheck(controllers, __type.array, true, 'controllers param expects an array.')
    __typecheck(middlewares, __type.array, true, 'middlewares param expects an array.')
    __typecheck(errorMiddleware, __type.object, true)

    __logger.info('Server start initialization...')
    return start({ port, host, controllers, middlewares, errorMiddleware })
  }
}

function start ({ port, host, controllers, middlewares, errorMiddleware }) {
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

    process.on('unhandledRejection', (reason, promise) => {
      __logger.error('unhandledRejection', reason)
    })

    process.on('rejectionHandled', promise => {
      __logger.warn('rejectionHandled', promise)
    })

    process.on('multipleResolves', (type, promise, reason) => {
      __logger.error('multipleResolves', { type, promise, reason })
    })

    process.on('uncaughtException', error => {
      __logger.fatal('uncaughtException', error.stack)
      process.exit(1)
    })

    return app.listen(port, host, () => resolve({ port, host }))
  })
}

module.exports = Server
