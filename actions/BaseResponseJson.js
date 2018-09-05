class BaseResponseJson {
  constructor (options) {
    __typecheck(options, __type.object, true)

    this.success = options.success || true
    this.data = options.data || undefined
    this.message = options.message || undefined
  }
}

module.exports = BaseResponseJson
