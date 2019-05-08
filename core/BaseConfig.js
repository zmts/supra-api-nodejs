require('dotenv').config()
const joi = require('joi')

class BaseConfig {
  /**
   * validate value via validate function and return it
   * @param value
   * @param validate
   * @returns {*}
   */
  set (value, validate) {
    if (validate && (typeof validate === 'function' || validate.isJoi)) {
      if (validate.isJoi) {
        const result = joi.validate(value, validate)
        if (!result.error) return value
        throw new Error(`Wrong env variable ${value} is invalid. ${result.error}`)
      }

      if (!validate(value)) {
        throw new Error(`Wrong env variable ${value} is invalid.`)
      }

      return value
    }

    throw new Error('validate should be a function or joi rule.')
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
      throw new Error(`Missing environment variable. ${env} must be set`)
    }
    return process.env[env]
  }

  get joi () {
    return joi
  }
}

module.exports = BaseConfig
