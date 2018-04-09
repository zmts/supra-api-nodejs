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

const controllers = require('./controllers')
const registry = require('./registry')
const devErrorMiddleware = require('./middlewares/error/devErrorMiddleware')
const prodErrorMiddleware = require('./middlewares/error/prodErrorMiddleware')

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
    this.setDefaultErrorMiddleware()
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

  setDefaultErrorMiddleware () {
    if (this.express.get('env') === 'development') {
      this.express.use(devErrorMiddleware)
    }

    this.express.use(prodErrorMiddleware)
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
