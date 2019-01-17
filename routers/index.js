const RootRouter = require('./RootRouter')
const AuthRouter = require('./AuthRouter')
const PostsRouter = require('./PostsRouter')
const UsersRouter = require('./UsersRouter')

module.exports = [
  RootRouter,
  AuthRouter,
  PostsRouter,
  UsersRouter
]
