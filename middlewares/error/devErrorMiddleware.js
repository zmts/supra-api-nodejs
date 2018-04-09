const stackTrace = require('stack-trace')
const chalk = require('chalk')

module.exports = (error, req, res, next) => {
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
}
