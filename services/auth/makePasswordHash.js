const bcrypt = require('bcryptjs')

module.exports = password => {
  __typecheck(password, 'String', true)

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) return reject(error)

      bcrypt.hash(password, salt, (error, hash) => {
        if (error) return reject(error)
        return resolve(hash)
      })
    })
  })
}
