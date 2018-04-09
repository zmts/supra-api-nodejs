module.exports = (error, req, res, next) => {
  if (error.status === 404) {
    return res.status(404).json({
      success: false,
      error: error.message,
      env: 'prod/regular'
    })
  }

  res.status(error.status || 500).json({
    success: false,
    description: error.message || error,
    env: 'prod/regular'
  })
}
