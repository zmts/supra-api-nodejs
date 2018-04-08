const jwt = require('jsonwebtoken')

module.exports.verify = (token, SECRET) => {
  __typecheck(token, 'String', true)
  __typecheck(SECRET, 'String', true)

  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) return reject(error)
      return resolve(decoded)
    })
  })
}

module.exports.sign = (playload, SECRET, options) => {
  __typecheck(playload, 'Object', true)
  __typecheck(SECRET, 'String', true)
  __typecheck(options, 'Object', true)

  return new Promise((resolve, reject) => {
    jwt.sign(playload, SECRET, options, (error, token) => {
      if (error) return reject(error)
      return resolve(token)
    })
  })
}
