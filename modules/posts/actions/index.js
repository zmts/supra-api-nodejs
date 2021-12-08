const { ListPostsAction } = require('./ListPostsAction')
const { GetPostByIdAction } = require('./GetPostByIdAction')
const { CreatePostAction } = require('./CreatePostAction')
const { UpdatePostAction } = require('./UpdatePostAction')
const { RemovePostAction } = require('./RemovePostAction')
const { UploadFileAction } = require('./UploadFileAction')

module.exports = {
  ListPostsAction,
  GetPostByIdAction,
  CreatePostAction,
  UpdatePostAction,
  RemovePostAction,
  UploadFileAction
}
