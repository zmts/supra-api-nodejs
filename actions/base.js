/*
request flow:
sanitize(in global middleware) >>

run (req, res, next) {
  return this.checkPermissions(this.permissions)
    .then(() => this.validate(this.validationRules()))
    .then(() => {
      // some process with data and response to client
    }).catch(error => next(error))
}
*/

/**
 * @description base action
 */
class Base {
  basePermissions () {
    return {
      anonymous: false
    }
  }

  baseValidationRules () {
    return {
      baseRule: 'bbbb'
    }
  }

  /**
   * @description default run method, needs to be redefined
   * @param req
   * @param res
   * @param next
   */
  run (req, res, next) {
    res.json({ data: 'base action, needs to be redefined' })
  }

  /**
   * @description check action permissions
   * @param permissions
   */
  checkPermissions (permissions) {
    console.log(permissions)
    // if has permissions >> resolve
    // else >> reject
  }

  /**
   * @description validate request(params, query, body)
   * @param res
   * @param rules
   */
  validate (res, rules) {
    console.log(rules)
    console.log(this.permissions())
    // if valid >> resolve
    // else >> reject
  }
}

module.exports = Base
