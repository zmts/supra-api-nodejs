const express = require('express')
const router = express.Router()

const BaseController = require('./BaseController')
const actionRunner = require('../actions/actionRunner')
const actions = require('../actions/auth')

class AuthController extends BaseController {
  static get router () {
    router.post('/login', actionRunner(actions.LoginAction))
    // router.post('/logout', auth.checkToken(), sec.isLoggedIn(), auth.signOut())
    router.post('/refresh-tokens', actionRunner(actions.RefreshTokensAction))
    router.get('/test-refresh-token', actionRunner(actions.TestRefreshTokenAction))

    return router
  }
}

module.exports = AuthController

/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: token
 */

/**
 * @swagger
 * definitions:
 *   Tokens:
 *    properties:
 *      accessToken:
 *        type: string
 *      refreshToken:
 *        type: string
 *      expiresIn:
 *        type: integer
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Log in
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *          properties:
 *            password:
 *              type: string
 *            email:
 *              type: string
 *     responses:
 *       200:
 *         description: Return access and refresh tokens
 *         schema:
 *            $ref: '#/definitions/Tokens'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     tags:
 *       - Auth
 *     description: Refresh tokens
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *          properties:
 *            refreshToken:
 *              type: string
 *     responses:
 *       200:
 *         description: Return access and refresh tokens
 *         schema:
 *           $ref: '#/definitions/Tokens'
 */
