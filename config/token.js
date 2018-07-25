module.exports = {
  access: {
    type: 'TOKEN_TYPE_ACCESS',
    secret: '908df97bf897gdf8bdf87dbcvbidfjgklrjt84',
    expiresIn: '10m'
  },

  refresh: {
    type: 'TOKEN_TYPE_REFRESH',
    secret: '32afaf980aab5f6ac492af6c264b34e19beefe',
    expiresIn: '60m'
  },

  resetPassword: {
    type: 'TOKEN_TYPE_RESET_PASSWORD',
    secret: 'qP5g3MN62gyteurke88rrakcJw3pnh8yqdk7fz6G',
    expiresIn: '12h'
  },

  confirmEmail: {
    type: 'TOKEN_TYPE_CONFIRM_EMAIL',
    secret: '89tWcgj8gjiG4ikwu2nrF95g5us35BiktQdktmkf',
    expiresIn: '30d'
  },

  encryptkey: '11111111112222222222333333333344' // Must be 256 bytes (32 characters)
}
