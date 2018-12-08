const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const Model = require('objection').Model
const Knex = require('knex')

const config = require('./config')
const errorCodes = require('./config').errorCodes
const ErrorWrapper = require('./util/ErrorWrapper')
const routers = require('./routers')
const corsMiddleware = require('./middlewares/corsMiddleware')
const devErrorMiddleware = require('./middlewares/error/devErrorMiddleware')
const prodErrorMiddleware = require('./middlewares/error/prodErrorMiddleware')

class App {
  constructor () {
    __logger({ message: ('server start initialization...') })
    this.express = express()

    this.initDbConnection()
    this.middleware()

    // routes and error handlers
    this.initRoutes()
    this.setDefaultErrorMiddlewares()
    this.setUncaughtExceptionHandler()
    this.logStatus()
  }

  middleware () {
    // uncomment after placing your favicon in /public
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    if (process.env.NODE_ENV === 'development') this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(cookieParser())
    // use static/public folder
    this.express.use(express.static(path.join(__dirname, 'public')))
    this.express.use(corsMiddleware)
    // print config/env
  }

  initDbConnection () {
    Model.knex(Knex(config.knex))
  }

  initRoutes () {
    this.express.use(routers.router)
  }

  setDefaultErrorMiddlewares () {
    if (this.express.get('env') === 'production') {
      this.express.use(prodErrorMiddleware)
    } else {
      this.express.use(devErrorMiddleware)
    }

    this.express.use((req, res, next) => {
      res.status(404).json(new ErrorWrapper({ ...errorCodes.ROUTE_NOT_FOUND }))
    })
  }

  logStatus () {
    __logger({ message: 'server was successfully initialized ...' })
    __logger({ message: 'NODE_ENV:', log: process.env.NODE_ENV })
    __logger({ message: 'App config:', log: config.app })
    __logger({ message: 'DB config:', log: config.knex })
  }

  setUncaughtExceptionHandler () {
    process.on('uncaughtException', error => {
      __logger({ message: '>------------------------------>', type: 'danger' })
      __logger({ message: `${new Date()} uncaughtException`, type: 'danger' })
      __logger({ message: error.stack, type: 'danger' })
      __logger({ message: '<------------------------------<', type: 'danger' })
      process.exit(1)
    })
  }
}

module.exports = new App().express
