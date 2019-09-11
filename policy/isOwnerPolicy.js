const { assert } = require('supra-core')

module.exports = (model, currentUser) => {
  assert.object(model, { required: true })
  assert.object(currentUser, { required: true })

  return new Promise((resolve, reject) => {
    currentUser.id === model.userId ? resolve(true) : resolve(false)
  })
}

