const Joi = require('joi')
const celebrate = require('celebrate')

/**
 * @description validate params IDs via Joi schema
 */
module.exports.id = function () {
    return celebrate({
        params: Joi.object().keys({
            id: Joi.number().integer(),
            tag_id: Joi.number().integer(),
            post_id: Joi.number().integer(),
            album_id: Joi.number().integer(),
            photo_id: Joi.number().integer()
        })
    })
}

/**
 * @description validate 'q' from query via Joi schema
 */
module.exports.query = function (schema) {
    let defaultSchema = {
        query: Joi.object().keys({
            q: Joi.string().min(2).max(50).required(),
        })
    }

    schema = schema || defaultSchema

    return celebrate(schema)
}

/**
 * @description validate response body via Joi schema
 * @param schema
 */
module.exports.body = function (schema) {
    return celebrate(schema)
}
