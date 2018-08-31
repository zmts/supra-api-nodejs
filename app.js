require('dotenv').load()
require('./globals')()
global.Promise = require('bluebird')

const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const Model = require('objection').Model
const Knex = require('knex')

const config = require('./config')
const errorCodes = require('./config').errorCodes
const ErrorWrapper = require('./util/ErrorWrapper')
const controllers = require('./controllers')
const corsMiddleware = require('./middlewares/corsMiddleware')
const devErrorMiddleware = require('./middlewares/error/devErrorMiddleware')
const prodErrorMiddleware = require('./middlewares/error/prodErrorMiddleware')

class App {
  constructor () {
    this.express = express()

    this.initDbConnection()
    this.middleware()

    // routes and error handlers
    this.initRoutes()
    this.setDefaultErrorMiddlewares()
    this.setUncaughtExceptionHandler()
  }

  middleware () {
    // uncomment after placing your favicon in /public
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    this.express.use(logger('dev'))
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(cookieParser())
    // use static/public folder
    this.express.use(express.static(path.join(__dirname, 'public')))
    this.express.use(corsMiddleware)
  }

  initDbConnection () {
    Model.knex(Knex(config.knex))
  }

  initRoutes () {
    this.express.use(controllers.router)
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

  setUncaughtExceptionHandler () {
    process.on('uncaughtException', error => {
      console.log(chalk.red('>------------------------------>'))
      console.log(chalk.red(`${new Date()} uncaughtException`))
      console.log(chalk.blue(error.stack))
      console.log(chalk.red('<------------------------------<'))
      process.exit(1)
    })
  }
}

module.exports = new App().express
