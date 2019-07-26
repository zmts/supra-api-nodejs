const BaseModel = require('./BaseModel')

class PostModel extends BaseModel {
  static get schema () {
    return {
      id: {
        type: Number,
        validator: this.joi.number().integer().positive(),
        default: null,
        description: 'number integer positive'
      },
      title: {
        type: String,
        validator: this.joi.string().min(3).max(20),
        default: null,
        description: 'min 3; max 20;'
      },
      content: {
        type: String,
        validator: this.joi.string().min(3).max(5000),
        default: null,
        description: 'min 3; max 5000;'
      }
    }
  }
}

module.exports = PostModel
