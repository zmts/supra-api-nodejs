const jwt = require('jsonwebtoken')
const { errorCodes, AppError, assert } = require('supra-core')

/**
 * @return {Promise} true/Error
 */
module.exports.verify = (token, SECRET) => {
  assert.string(token, { notEmpty: true })
  assert.string(SECRET, { notEmpty: true })

  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return reject(new AppError({ ...errorCodes.TOKEN_EXPIRED }))
        }
        return reject(new AppError({ ...errorCodes.TOKEN_VERIFY, message: error.message }))
      }
      return resolve(decoded)
    })
  })
}

/**
 * @return {Promise} string (token)
 */
module.exports.sign = (playload, SECRET, options) => {
  assert.object(playload, { required: true })
  assert.string(SECRET, { notEmpty: true })
  assert.object(options, { notEmpty: true })

  return new Promise((resolve, reject) => {
    jwt.sign(playload, SECRET, options, (error, token) => {
      if (error) return reject(new AppError({ ...errorCodes.TOKEN_NOT_SIGNED, message: error.message }))
      return resolve(token)
    })
  })
}
