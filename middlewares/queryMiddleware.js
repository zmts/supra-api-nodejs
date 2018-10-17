module.exports = async (req, res, next) => {
  if (req.method === 'GET') {
    try {
      req.query = {
        ...req.query,
        page: Number(req.query.page) || 0,
        limit: Number(req.query.limit) || 10,
        filter: req.query.filter || {},
        orderBy: req.query.orderBy || { field: 'createdAt', direction: 'asc' }
      }
      next()
    } catch (error) {
      next(error)
    }
  } else {
    next()
  }
}
