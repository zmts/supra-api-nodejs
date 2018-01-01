require('dotenv').config()

const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./config')
const chalk = require('chalk')

const controllers = require('./controllers')

const app = express()

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// use static/public folder
app.use(express.static(path.join(__dirname, 'public')))

// enable CORS only for local client
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', config.client.host + ':' + '8080')
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
  next()
})

// routers init
app.use(controllers)

// catch 'No route found' Error
app.use(function (req, res, next) {
  res.status(404).json({ success: false, error: '404, No route found' })
})

// development error handler
if (app.get('env') === 'development') {
  app.use(function (error, req, res, next) {
    if (error.stack) {
      console.log(chalk.red('##############################'))
      console.log(chalk.red(`### ${new Date} env:development/regular error`))
      console.log(chalk.red(`### ${error.message}`))
      console.log(chalk.red('### error.stack'))
      console.log(chalk.blue(error.stack))
      console.log(chalk.red('##############################'))
    }

    res.status(error.status || (error.isJoi ? 400 : 500)).json({
      success: false,
      description: error.message || error,
      env: 'development/regular'
    })
  })
}

// production error handler
app.use(function (error, req, res, next) {
  res.status(error.status || 500).json({
    success: false,
    description: error.message || error,
    env: 'production/regular'
  })
})

// uncaughtException error handler
process.on('uncaughtException', function (error) {
  console.log(chalk.red('##############################'))
  console.log(chalk.red(`### ${new Date} uncaughtException`))
  console.log(chalk.red(`### ${error.message}`))
  console.log('### error.stack')
  console.log(chalk.blue(error.stack))
  console.log(chalk.red('##############################'))
  process.exit(1)
})

module.exports = app
