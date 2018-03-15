module.exports.actionRunner = (action = global.required('action')) => {
  return (req, res, next) => {
    return action.run(req, res, next)
  }
}
