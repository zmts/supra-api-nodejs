const jwt = require('jsonwebtoken')

module.exports.verify = (token, SECRET) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) return reject(error)
      return resolve(decoded)
    })
  })
}

module.exports.sign = (playload, SECRET, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(playload, SECRET, options, (error, token) => {
      if (error) return reject(error)
      return resolve(token)
    })
  })
}
