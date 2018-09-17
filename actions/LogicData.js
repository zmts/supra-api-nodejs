class LogicData {
  constructor (options) {
    __typecheck(options, __type.object, true)
    __typecheck(options.data, __type.object, true)
    __typecheck(options.currentUser, __type.object, true)

    this.data = options.data
    this.currentUser = options.currentUser
    this.filter = options.filter || {}
    this.orderBy = options.orderBy || 'createdAt:asc'
    this.pagination = options.pagination || { page: 0, limit: 10 }
    this.meta = options.meta || {}
    this.q = options.q || null
  }
}

module.exports = LogicData
