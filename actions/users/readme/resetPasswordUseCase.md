# Reset password use case

## First part ([POST] users/send-reset-email endpoint):
1. User press forgot/reset password
2. User types and send email
3. API validate and search email
4. API generate JWT(with user payload data) and send it to user email

## Second part ([GET] https://super.com/reset-password?resetPasswordToken=tokenBody):
1. User click reset password link founded in received email
2. Front-end show reset password form
3. User types new password and send it with JWT taken from URL

## Third part ([POST] users/reset-password endpoint):
1. API parses JWT and change user password by id founded in JWT
