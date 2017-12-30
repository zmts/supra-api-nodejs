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

  execute (req, res, next) {
    res.json({ data: 'base action, needs to redefined' })
  }

  validate (rules) {
    console.log(rules)
    console.log(this.permissions())
    // if valid >> return data
    // else >> throw error
  }

  // run (data) {
  //   this.validate(data).then(() => data)
  // }
}

module.exports = Base
