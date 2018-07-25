module.exports = {
  NO_ARGUMENT: { message: 'Required arguments not supplied', status: 500, code: 'NO_ARGUMENT_ERROR' },
  ARGUMENT_TYPE: { message: 'Wrong argument type', status: 500, code: 'ARGUMENT_TYPE_ERROR' },
  ACCESS: { message: 'Access denied', status: 403, code: 'ACCESS_ERROR' },
  NO_ANONYMOUS_ACCESS: { message: 'Access denied. No anonymous access', status: 403, code: 'NO_ANONYMOUS_ACCESS_ERROR' },
  BAD_ROLE: { message: 'Bad role', status: 403, code: 'BAD_ROLE_ERROR' },
  INVALID_PASSWORD: { message: 'Invalid password', status: 403, code: 'INVALID_PASSWORD_ERROR' },
  TOKEN_EXPIRED: { message: 'Token expired', status: 401, code: 'TOKEN_EXPIRED_ERROR' },
  TOKEN_NOT_SIGNED: { message: 'Token not signed', status: 500, code: 'TOKEN_NOT_SIGNED_ERROR' },
  TOKEN_VERIFY: { message: 'Token verify error', status: 401, code: 'TOKEN_VERIFY_ERROR' },
  BAD_REFRESH_TOKEN: { message: 'Bad Refresh token', status: 401, code: 'BAD_REFRESH_TOKEN_ERROR' },
  WRONG_RESET_PASSWORD_TOKEN: { message: 'Wrong reset password token', status: 401, code: 'WRONG_RESET_PASSWORD_TOKEN_ERROR' },
  WRONG_EMAIL_CONFIRM_TOKEN: { message: 'Wrong confirm email token', status: 401, code: 'WRONG_EMAIL_CONFIRM_TOKEN_ERROR' },
  EMAIL_ALREADY_TAKEN: { message: 'This email already taken, try use another', status: 409, code: 'EMAIL_ALREADY_TAKEN_ERROR' },
  DECRYPTION: { message: 'Decryption error', status: 500, code: 'DECRYPTION_ERROR' },
  NOT_FOUND: { message: 'Empty response, not found', status: 404, code: 'NOT_FOUND_ERROR' },
  DB: { status: 500, code: 'DB_ERROR' }
}
