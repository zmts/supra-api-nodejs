module.exports.actionRunner = (action) => {
  return (req, res, next) => {
    action.run(req, res, next)
  }
}
