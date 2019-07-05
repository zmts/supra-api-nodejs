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
   * validate value and return it
   * @param value
   * @param validator
   * @returns {*}
   */
  set (value, validator) {
    if (validator && (typeof validator === 'function' || validator.isJoi)) {
      if (validator.isJoi) {
        const joiResult = joi.validate(value, validator)
        if (!joiResult.error) return value
        throw new Error(`Wrong env variable "${value}" is invalid. ${joiResult.error}`)
      }

      if (!validator(value)) {
        throw new Error(`Wrong env variable "${value}" is invalid.`)
      }

      return value
    }

    throw new Error('validator should be a function or joi rule.')
  }

  /**
   * get environment variable
   * log warn if environment variable missing and get default value
   * @param env
   * @param defaultVal
   * @returns {string}
   */
  getEnv (env, defaultVal) {
    if (!process.env.hasOwnProperty(env)) {
      warnLogger.warn(`Missing env variable: "${env}". Default value was applied: ${defaultVal}`)
    }
    return process.env[env] || defaultVal
  }

  get joi () {
    return joi
  }
}

module.exports = BaseConfig
