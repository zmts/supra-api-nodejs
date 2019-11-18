const pino = require('pino')

require('dotenv').config()
const joi = require('@hapi/joi')

const warnLogger = pino({
  name: 'env-warning',
  prettyPrint: {
    translateTime: 'SYS:standard'
  }
})

class BaseConfig {
  /**
   * get environment variable
   * if env variable missing: log warn and get default value
   * validate value and return it
   * @param env
   * @param validator
   * @param defaultVal
   * @returns {*}
   */
  set (env, validator, defaultVal) {
    let value
    if (process.env[env] || (process.env[env] === '')) {
      value = process.env[env]
    } else {
      if (defaultVal === undefined) {
        throw new Error(`Missing default value "${env}".`)
      }
      value = defaultVal
      warnLogger.warn(`Missing env variable: "${env}". Default value was applied: ${defaultVal}`)
    }

    if (validator && (typeof validator === 'function' || typeof validator === 'object')) {
      if (typeof validator === 'object') { // joi object
        const joiResult = validator.validate(value)
        if (!joiResult.error) return value
        throw new Error(`Wrong "${env}" variable; Value: "${value}" is invalid. ${joiResult.error}`)
      }

      if (!validator(value)) {
        throw new Error(`Wrong "${env}" variable; Value: "${value}" is invalid.`)
      }

      return value
    }

    throw new Error('validator should be a function or joi rule.')
  }

  get joi () {
    return joi
  }
}

module.exports = { BaseConfig }
