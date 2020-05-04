const { RootController } = require('../modules/root/RootController')
const { AuthController } = require('../modules/auth/AuthController')
const { PostsController } = require('../modules/posts/PostsController')
const { UsersController } = require('../modules/users/UsersController')

module.exports = [
  RootController,
  AuthController,
  PostsController,
  UsersController
]
