module.exports.actionRunner = (action) => {
  return (req, res, next) => {
    action.execute(req, res, next)
  }
}
