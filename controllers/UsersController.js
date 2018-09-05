const router = require('express').Router()

const actions = require('../actions/users')
const BaseController = require('./BaseController')

class UsersController extends BaseController {
  static get router () {
    router.get('/', this.actionRunner(actions.ListAction))
    router.get('/:id', this.actionRunner(actions.GetByIdAction))
    router.post('/', this.actionRunner(actions.CreateAction))
    router.patch('/', this.actionRunner(actions.UpdateAction))
    router.delete('/:id', this.actionRunner(actions.RemoveAction))
    router.get('/:id/posts', this.actionRunner(actions.GetPostsByUserIdAction))

    router.post('/change-password', this.actionRunner(actions.ChangePasswordAction))
    router.post('/send-reset-email', this.actionRunner(actions.SendResetEmailAction))
    router.post('/reset-password', this.actionRunner(actions.ResetPasswordAction))

    router.post('/confirm-email', this.actionRunner(actions.ConfirmEmailAction))
    router.post('/send-email-confirm-token', this.actionRunner(actions.SendEmailConfirmTokenAction))
    router.post('/change-email', this.actionRunner(actions.ChangeEmailAction))

    return router
  }
}

module.exports = UsersController

/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       username:
 *         type: string
 *       email:
 *         type: string
 *   NewUser:
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
 *   UserUpdate:
 *     properties:
 *       name:
 *         type: string
 *       username:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns users list
 *     parameters:
 *       - name: token
 *         in: header
 *         type: string
 *       - name: page
 *         description: page number
 *         in: query
 *         type: integer
 *       - name: limit
 *         description: limit
 *         in: query
 *         type: integer
 *         x-example: 10
 *     responses:
 *       200:
 *         description: An array of users
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a single user
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
 *     description: Creates a new entity
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: Return new user object
 *         schema:
 *           $ref: '#/definitions/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     description: Update entity by id
 *     parameters:
 *       - name: id
 *         description: id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserUpdate'
 *     responses:
 *       200:
 *         description: Return updated entity object
 *         schema:
 *           $ref: '#/definitions/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Remove user by id
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Success status
 */

/**
 * @swagger
 * /users/{id}/posts:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns post list by user id
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: page
 *         description: page number
 *         in: query
 *         type: integer
 *       - name: limit
 *         description: limit
 *         in: query
 *         type: integer
 *         x-example: 10
 *     responses:
 *       200:
 *         description: An array of posts
 */

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     tags:
 *       - Users
 *     description: Change user password
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *          properties:
 *            oldPassword:
 *              type: string
 *            newPassword:
 *              type: string
 *     responses:
 *       200:
 *         description: Return user object
 */

/**
 * @swagger
 * /users/send-reset-email:
 *   post:
 *     tags:
 *       - Users
 *     description: Send email to reset user password
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *          properties:
 *            email:
 *              type: string
 *     responses:
 *       200:
 *         description: Return success status
 */

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     tags:
 *       - Users
 *     description: Reset password form
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *          properties:
 *            resetPasswordToken:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: Success status
 */

/**
 * @swagger
 * /users/confirm-email:
 *   post:
 *     tags:
 *       - Users
 *     description: 1) After registration user must confirm email. 2) After user change email user must confirm email again
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *          properties:
 *            emailConfirmToken:
 *              type: string
 *     responses:
 *       200:
 *         description: Success status
 */

/**
 * @swagger
 * /users/send-email-confirm-token:
 *   post:
 *     tags:
 *       - Users
 *     description: Send email with confirmation token.
 *     responses:
 *       200:
 *         description: Success status
 */

/**
 * @swagger
 * /users/change-email:
 *   post:
 *     tags:
 *       - Users
 *     description: We can't change email via update user entity, so to change email we use separate endpoint. After that front-end must invoke '/users/confirm-email'
 *     parameters:
 *       - name: jsonData
 *         description: request object
 *         in: body
 *         required: true
 *         schema:
 *          properties:
 *            email:
 *              type: string
 *     responses:
 *       200:
 *         description: Success status
 */

