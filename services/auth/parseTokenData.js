const jwt = require('jsonwebtoken')

module.exports = token => {
  __typecheck(token, 'String', true)

  let tokenData = jwt.decode(token)

  return new Promise((resolve, reject) => {
    if (!tokenData) return reject(new Error('Trying get data from access token. Something wrong'))
    return resolve(tokenData)
  })
}
