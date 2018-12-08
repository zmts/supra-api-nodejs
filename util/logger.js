const chalk = require('chalk')

module.exports = ({ message, log = '', type = 'info' }) => {
  if (type === 'warn') {
    console.log(chalk.orange(message), log)
  }
  if (type === 'danger') {
    console.log(chalk.red(message), log)
  }
  if (type === 'info') {
    console.log(chalk.green(message), log)
  }
}
