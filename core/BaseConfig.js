require('dotenv').config()
const joi = require('@hapi/joi')

class BaseConfig {
  /**
   * validate value via validate function and return it
   * @param value
   * @param validator
   * @returns {*}
   */
  set (value, validator) {
    const isValidValueType = typeof value === 'number' || typeof value === 'string'
    if (!isValidValueType) {
      throw new Error(`Wrong env variable "${typeof value}" is invalid.`)
    }

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
   * if environment variable is missing throw error
   * use in case when environment variable must be required
   * @param env
   * @returns {string}
   */
  getEnv (env) {
    if (!process.env.hasOwnProperty(env)) {
      throw new Error(`Missing environment variable. "${env}" must be set`)
    }
    return process.env[env]
  }

  get joi () {
    return joi
  }
}

module.exports = BaseConfig
