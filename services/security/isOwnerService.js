module.exports = (model, currentUser) => {
  __typecheck(model, __type.object, true)
  __typecheck(currentUser, __type.object, true)

  return new Promise((resolve, reject) => {
    currentUser.id === model.userId ? resolve(true) : resolve(false)
  })
}

