module.exports.actionRunner = (Action) => {
  return (req, res, next) => {
    return new Action().run(req, res, next)
  }
}
