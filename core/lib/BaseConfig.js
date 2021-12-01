const pino = require('pino')

require('dotenv').config()
const joi = require('joi')

// base logger should have own logger instance
// because it runs before server starts, so we cant use root logger
const warnLogger = pino({
  name: 'config-env-warning',
  ...(process.env.NODE_ENV === 'development' && { prettyPrint: { translateTime: 'SYS:standard' } })
})

class BaseConfig {
  async init () {
    throw new Error(`${this.constructor.name} should implement 'init' method.`)
  }
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

  /**
   * validate and set value directly(not from environment variables)
   * @param validator
   * @param val
   * @param defaultVal
   */
  setDirect (val, validator, defaultVal) {
    let value
    if (val || (val === '')) {
      value = val
    } else {
      if (defaultVal === undefined) {
        throw new Error('Missing default value')
      }
      value = defaultVal
      warnLogger.warn(`Missing direct value: "${val}". Default value was applied: ${defaultVal}`)
    }

    if (validator && (typeof validator === 'function' || typeof validator === 'object')) {
      if (typeof validator === 'object') { // joi object
        const joiResult = validator.validate(value)
        if (!joiResult.error) return value
        throw new Error(`Value: "${value}" is invalid. ${joiResult.error}`)
      }

      if (!validator(value)) {
        throw new Error(`Value: "${value}" is invalid.`)
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
