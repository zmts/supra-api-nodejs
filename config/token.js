module.exports = {
  access: {
    type: 'TOKEN_TYPE_ACCESS',
    secret: process.env.TOKEN_ACCESS_SECRET,
    expiresIn: process.env.TOKEN_ACCESS_EXP
  },

  refresh: {
    type: 'TOKEN_TYPE_REFRESH',
    secret: process.env.TOKEN_REFRESH_SECRET,
    expiresIn: process.env.TOKEN_REFRESH_EXP
  },

  resetPassword: {
    type: 'TOKEN_TYPE_RESET_PASSWORD',
    secret: process.env.TOKEN_RESET_PASSWORD_EXP,
    expiresIn: process.env.TOKEN_RESET_PASSWORD_SECRET
  },

  emailConfirm: {
    type: 'TOKEN_TYPE_EMAIL_CONFIRM',
    secret: process.env.TOKEN_EMAIL_CONFIRM_EXP,
    expiresIn: process.env.TOKEN_EMAIL_CONFIRM_SECRET
  }
}
