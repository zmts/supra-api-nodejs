class LogicData {
  constructor (options) {
    __typecheck(options, __type.object, true)
    __typecheck(options.data, __type.object, true)
    __typecheck(options.currentUser, __type.object, true)

    this.data = options.data
    this.currentUser = options.currentUser
    this.meta = options.meta || {}
    this.q = options.q || null
    this.query = {
      ...options.query,
      filter: options.query.filter || {},
      orderBy: options.query.orderBy || 'createdAt:asc',
      page: options.query.page || 0,
      limit: options.query.limit || 10
    }
  }
}

module.exports = LogicData
