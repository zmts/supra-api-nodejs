const path = require('path')
const { PassThrough } = require('stream')
const express = require('express')
const morganLogger = require('morgan')
const cookieParser = require('cookie-parser')
const formidable = require('formidable')

const { Assert: assert } = require('./assert')
const { BaseMiddleware } = require('./BaseMiddleware')
const { AbstractLogger } = require('./AbstractLogger')

class Server {
  constructor ({ port, host, controllers, middlewares, errorMiddleware, cookieSecret, reqLimit = '5mb', logger }) {
    assert.integer(port, { required: true, min: 1000 })
    assert.string(host, { required: true, notEmpty: true })
    assert.array(controllers, { required: true, notEmpty: true, message: 'controllers param expects not empty array' })
    assert.array(middlewares, { required: true, notEmpty: true, message: 'middlewares param expects not empty array' })
    assert.instanceOf(errorMiddleware.prototype, BaseMiddleware)
    assert.string(cookieSecret)
    assert.string(reqLimit)
    assert.instanceOf(logger, AbstractLogger)

    logger.info('Server start initialization...')
    return start({ port, host, controllers, middlewares, ErrorMiddleware: errorMiddleware, cookieSecret, reqLimit, logger })
  }
}

function start ({ port, host, controllers, middlewares, ErrorMiddleware, cookieSecret, reqLimit, logger }) {
  return new Promise(async (resolve, reject) => {
    const app = express()

    if (process.env.NODE_ENV !== 'production') app.use(morganLogger('dev'))
    app.use(express.json({ limit: reqLimit }))
    app.use(express.urlencoded({ extended: false, limit: reqLimit }))
    app.use(cookieParser(cookieSecret))
    app.use(express.static(path.join(__dirname, 'public')))

    /**
     * middlewares initialization
     */
    try {
      for (const middleware of middlewares.map(Middleware => new Middleware({ logger }))) {
        await middleware.init()
        app.use(middleware.handler())
      }
    } catch (e) {
      return reject(e)
    }

    /**
     * formData middleware
     */
    app.use(async (req, res, next) => {
      try {
        const contentType = (req.get('Content-Type') || '').toLowerCase()
        const isMultipartForm = contentType.includes('multipart/form-data')
        req.formData = isMultipartForm ? parseFormDataAsStream.bind(null, req) : () => Promise.resolve({ fields: [], files: [] })
      } catch (e) {
        return reject(e)
      }
      next()
    })

    /**
     * controllers initialization
     */
    try {
      for (const controller of controllers.map(Controller => new Controller({ logger }))) {
        await controller.init()
        app.use(controller.router)
      }
    } catch (e) {
      reject(e)
    }

    /**
     * error handler
     */
    try {
      const middleware = new ErrorMiddleware({ logger })
      await middleware.init()
      app.use(middleware.handler())
    } catch (e) {
      return reject(e)
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
      logger.fatal('uncaughtException', error)
      process.exit(1)
    })

    return app.listen(port, host, () => resolve({ port, host }))
  })
}

function parseFormDataAsStream (req, fileHandler) {
  assert.func(fileHandler, { required: true })

  return new Promise((resolve, reject) => {
    const form = formidable()

    const filesMap = {}
    const fieldsMap = {}
    const handlers = []

    form.onPart = part => { // part its formData file or field, emits for each value
      const { originalFilename, mimetype, transferEncoding } = part
      // put only file types to filesMap
      // if part has mimetype it means its file type, so we can put it
      if (!filesMap[originalFilename] && mimetype) {
        filesMap[originalFilename] = {
          key: part.name,
          filename: originalFilename,
          stream: new PassThrough(),
          mime: mimetype,
          encoding: transferEncoding,
          size: 0 // TODO: use for debug (remove after fixing)
        }
      }

      const fileObject = filesMap[originalFilename]
      const fileStream = fileObject?.stream

      part.on('data', data => { // data instanceof Buffer
        if (fileStream) {
          filesMap[originalFilename].size += data.length // TODO: use for debug (remove after fixing)

          try {
            // write file parts(buffer) to stream
            fileStream.write(data)
          } catch (e) {
            reject(e)
          }
        } else {
          // save field data buffer as string
          fieldsMap[part.name] = data.toString(transferEncoding)
        }
      })
      part.on('end', () => filesMap[originalFilename]?.stream.end())
      part.on('error', err => reject(err))

      if (fileObject) {
        handlers.push(Promise.resolve().then(() => fileHandler(fileObject)))
      }
    }

    form.parse(req, err => {
      if (err) {
        return reject(err)
      }
      Promise.all(handlers).then(() => resolve({ fields: fieldsMap })).catch(err => reject(err))
    })
  })
}

module.exports = { Server }
