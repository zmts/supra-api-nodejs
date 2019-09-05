module.exports = currentUser => {
  __typecheck(currentUser, __type.object, true)

  return new Promise((resolve, reject) => {
    currentUser.id ? resolve(true) : resolve(false)
  })
}
