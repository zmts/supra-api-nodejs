'use strict'

const SUPERUSER = require('../config').roles.superuser
const ADMINROLES = require('../config').roles.adminRoles
const EDITORROLES = require('../config').roles.editorRoles

/**
 * ------------------------------
 * @HELPERS
 * ------------------------------
 */

/**
 * @description: helper, check ADMINS role
 * @hasaccess ADMINROLES
 * @param req
 * @return {boolean}
 * @private
 */
function _isAdminUser(req) {
    if ( ADMINROLES.indexOf( req.body.helpData.userRole ) >= 0 ) return true // check ADMINS access
}

/**
 * @description: helper, check EDITORS role
 * @param req
 * @return {boolean}
 * @private
 */
function _isEditorUser(req) {
    if ( EDITORROLES.indexOf( req.body.helpData.userRole ) >= 0 ) return true // check EDITORS access
}

/**
 * @description helper, user_id from TOKEN and user_id from REQUEST BODY >>> MUST equals
 * @hasaccess OWNER, ADMINROLES
 * @param {Object} req
 * @returns {boolean}
 * @private
 */
function _isOwnerIdInBody(req) {
    if ( _isAdminUser(req) ) return true
    if ( +req.body.helpData.userId === +req.body.user_id ) return true
}

/**
 * @description: helper, user_id from TOKEN and user_id from MODEL >>> MUST equals
 * @hasaccess OWNER, ADMINROLES
 * @param {Object} req
 * @param {Object} model
 * @returns {boolean}
 * @private
 */
function _tokenUIDisEqualsModelUID(req, model) {
    if ( _isAdminUser(req) ) return true
    if ( +req.body.helpData.userId === +model.user_id ) return true
}

/**
 * @description: helper, user_id from TOKEN and user_id from REQUEST PARAMS >>> MUST equals
 * @hasaccess OWNER, ADMINROLES
 * @param {Object} req
 * @returns {boolean}
 * @private
 */
function _tokenUIDisEqualsParamsUID(req) {
    if ( _isAdminUser(req) ) return true
    if ( +req.body.helpData.userId === +req.params.id ) return true
}

/**
 * ------------------------------
 * @MIDDLEWARE
 * ------------------------------
 */

/**
 * @description if token.userRole is ADMINROLES >> add { isAdmin: true } to helpData
 */
module.exports.isAdmin = function () {
    return function (req, res, next) {
        if ( _isAdminUser(req) ) {
            req.body.helpData.isAdmin = true
            return next()
        }
        next()
    }
}

/**
 * @description if token.userId === params.user_id >> add { isOwner: true } to helpData
 */
module.exports.isOwnerIdInParams = function () {
    return function (req, res, next) {
        _tokenUIDisEqualsParamsUID(req) ? req.body.helpData.isOwner = true : req.body.helpData.isOwner = false
        return next()
    }
}

/**
 * @description check logged in user permission
 */
module.exports.isLoggedIn = function () {
    return function (req, res, next) {
        if (req.body.helpData.userId) return next()
        res.status(403).send({
            success: false,
            description: 'Forbidden. Only for logged in users'
        })
    }
}

/**
 * @description check ADMINROLES permission
 */
module.exports.checkAdminRoleAccess = function () {
    return function (req, res, next) {
        if (_isAdminUser(req)) return next()
        res.status(403).send({
            success: false,
            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
        })
    }
}

/**
 * @description check SUPERUSER permission
 */
module.exports.checkSUAccess = function () {
    return function (req, res, next) {
        if (req.body.helpData.userRole === SUPERUSER) return next()
        res.status(403).send({
            success: false,
            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
        })
    }
}

/**
 * @description check access to User profile
 * if ID from token === ID from PARAMS
 * @hasaccess: ADMINROLES, OWNER
 * @required: 'auth.checkToken' middleware
 */
module.exports.checkOwnerIdInParams = function () {
    return function (req, res, next) {
        if ( _tokenUIDisEqualsParamsUID(req) ) return next()
        res.status(403).send({
            success: false,
            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
        })
    }
}

/**
 * @description check access for Item model
 * can read, update, remove: ADMINROLES, EDITORROLES, OWNER
 * can read only public items: ANONYMOUS
 * @param {object} modelName - model that we want to modify
 * @required 'auth.checkToken' middleware
 */
module.exports.checkItemAccess = {

    /**
     * @description check >> user_id from TOKEN === user_id from MODEL
     */
    tokenUIDisEqualsModelUID: function (modelName) {
        return function (req, res, next) {
            modelName.GETbyId(req.params.id)
                .then(function (model) {
                    if ( _tokenUIDisEqualsModelUID(req, model) ) return next()
                    res.status(403).send({
                        success: false,
                        description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
                    })
                })
                .catch(function (error) {
                    res.status(404).send({ success: false, description: error })
                })
        }
    },

    read: function (modelName) {
        return function (req, res, next) {
            modelName.GETbyId(req.params.id)
                .then(function (model) {
                    if ( !model.private ) return next()
                    if ( _tokenUIDisEqualsModelUID(req, model) ) return next()
                    res.status(403).send({
                        success: false,
                        description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.params.id
                    })
                })
                .catch(function (error) {
                    res.status(404).send({ success: false, description: error })
                })
        }
    },

    create: function () {
        return function (req, res, next) {
            if ( _isOwnerIdInBody(req) ) return next()
            res.status(403).send({
                success: false,
                description: 'Forbidden. userId(' + req.body.helpData.userId + ') to #' + req.body.user_id
            })
        }
    },

    /**
     * @description check >> user_id from TOKEN === user_id from MODEL === equals user_id from BODY
     */
    update: function (modelName) {
        return function (req, res, next) {
            modelName.GETbyId(req.params.id)
                .then(function (model) {
                    // check owner access // forbid to User change Item 'user_id'
                    if ( _tokenUIDisEqualsModelUID(req, model) && _isOwnerIdInBody(req) ) return next()
                    // handle error if User not Item owner
                    else if ( !_tokenUIDisEqualsModelUID(req, model) ) {
                        res.status(403).send({
                            success: false,
                            description: 'Forbidden. userId(' + req.body.helpData.userId + ') to item#' + req.params.id
                        })
                    }
                    // handle error if User try change Item user_id
                    else if ( !_isOwnerIdInBody(req) ) {
                        res.status(403).send({
                            success: false,
                            description: 'Forbidden change \'user_id\'. For item#' + req.params.id + ' \'user_id\' must be #' + req.body.helpData.userId
                        })
                    }
                })
                .catch(function (error) {
                    res.status(404).send({ success: false, description: error })
                })
        }
    }
}
