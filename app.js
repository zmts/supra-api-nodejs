require('dotenv').load()
require('./globals')()
global.Promise = require('bluebird')

const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./config')
const chalk = require('chalk')
const Model = require('objection').Model
const Knex = require('knex')
const stackTrace = require('stack-trace')

const controllers = require('./controllers')
const registry = require('./registry')

class App {
  constructor () {
    this.express = express()

    this.middleware()
    this.initRegistry()
    this.setCORS()
    this.initDbConnection()

    // routes and error handlers
    this.initRoutes()
    this.setNoRouteFoundHandler()
    this.setDefaultErrorHandler()
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
  }

  initDbConnection () {
    Model.knex(Knex(config.knex))
  }

  setCORS () {
    this.express.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
      next()
    })
  }

  initRoutes () {
    this.express.use(controllers)
  }

  initRegistry () {
    registry.set('user', {})
  }

  setNoRouteFoundHandler () {
    this.express.use((req, res, next) => {
      res.status(404).json({ success: false, error: '404, No route found' })
    })
  }

  setDefaultErrorHandler () {
    /**
     * @DEVELOPMENT_ERROR_HANDLER
     */
    if (this.express.get('env') === 'development') {
      this.express.use((error, req, res, next) => {
        if (error.status === 404) {
          res.status(404).json({
            success: false,
            error: error.message,
            env: 'dev/regular'
          })
        } else if (error.isJoi) {
          res.status(400).json({
            success: false,
            valid: false,
            message: error.details[0].message,
            type: error.details[0].type,
            key: error.details[0].context.key,
            env: 'dev/regular'
          })
        } else {
          res.status(error.status || 500).json({
            success: false,
            message: error.message || error,
            stack: ![403].includes(error.status) ? stackTrace.parse(error) : false,
            env: 'dev/regular'
          })
        }
        if (error.stack) {
          console.log(chalk.red('>------------------------------>'))
          console.log(chalk.red(`${new Date()} env:dev/regular error`))
          console.log(chalk.blue(error.stack))
          console.log(chalk.red('<------------------------------<'))
        }
      })
    }

    /**
     * @PRODUCTION_ERROR_HANDLER
     */
    this.express.use((error, req, res, next) => {
      if (error.status === 404) {
        return res.status(404).json({
          success: false,
          error: error.message,
          env: 'prod/regular'
        })
      }

      res.status(error.status || 500).json({
        success: false,
        description: error.message || error,
        env: 'prod/regular'
      })
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
