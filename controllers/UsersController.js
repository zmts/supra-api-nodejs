const express = require('express')
const router = express.Router()

const actionRunner = require('../actions/actionRunner')
const actions = require('../actions/users')
const BaseController = require('./BaseController')

class UsersController extends BaseController {
  static get router () {
    router.get('/', actionRunner(actions.ListAction))
    router.get('/:id', actionRunner(actions.GetByIdAction))
    router.post('/', actionRunner(actions.CreateAction))
    router.patch('/', actionRunner(actions.UpdateAction))
    router.delete('/:id', actionRunner(actions.RemoveAction))
    router.get('/:id/posts', actionRunner(actions.GetPostsByUserIdAction))

    router.post('/change-password', actionRunner(actions.ChangePasswordAction))
    router.post('/send-reset-email', actionRunner(actions.SendResetEmailAction))
    router.post('/reset-password', actionRunner(actions.ResetPasswordAction))

    router.post('/confirm-email', actionRunner(actions.ConfirmEmailAction))
    router.post('/send-email-confirm-token', actionRunner(actions.SendEmailConfirmTokenAction))
    router.post('/change-email', actionRunner(actions.ChangeEmailAction))

    return router
  }
}

module.exports = UsersController

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       username:
 *         type: string
 *       email:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   UserCreate:
 *     properties:
 *       name:
 *         type: string
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns users list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         description: page number
 *         in: path
 *         type: integer
 *       - name: limit
 *         description: limit
 *         in: path
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           $ref: '#/definitions/User'
 */

/**
 * @swagger
 * /users{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single user
 *         schema:
 *           $ref: '#/definitions/User'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: json
 *         description: User object
 *         in: body
 *         schema:
 *           $ref: '#/definitions/UserCreate'
 *     responses:
 *       200:
 *         description: Return new user object
 *         schema:
 *           $ref: '#/definitions/User'
 */
