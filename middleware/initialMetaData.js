module.exports.initialMetaData = () => {
  return (req, res, next) => {
    req.meta = {
      user: {
        id: false,
        role: 'anonymous',
        isOwner: false
      }
    }
    next()
  }
}
