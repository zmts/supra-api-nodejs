const jwt = require('jsonwebtoken')
const Promise = require('bluebird')

module.exports.verify = (token, SECRET) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error, decoded) => {
      if (decoded) return resolve(decoded)
      return reject(error)
    })
  })
}

module.exports.sign = (playload, SECRET, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(playload, SECRET, options, function (error, token) {
      if (token) return resolve(token)
      return reject(error)
    })
  })
}
