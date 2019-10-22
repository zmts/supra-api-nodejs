# New user registration use case
1. User fill registration form [POST] /users (CreateUserAction)
2. Server creates user entity
3. Server send confirm registration email with `emailConfirmToken` link
4. User click confirm registration link in email [GET] `supra.com/frontend-spa/confirm-registration?emailConfirmToken=tokenBody`
5. Server check `emailConfirmToken` and update user entity to `{ isConfirmedRegistration: true, emailConfirmToken: null }` (ConfirmRegistrationAction)

# Change email use case
1. FE send body `{ email: 'new_email@gmail.com' }` [POST] api/users/change-email (ChangeEmailAction)
2. Server check is email already exist in DB if exist throw error
3. Generate `emailConfirmToken` (jwt)
4. Sends token to new email (`To confirm email: ${newEmail} please follow this link >> supra.com/users/confirm-email?emailConfirmToken=${emailConfirmToken}`)
5. Stores `newEmail` and `emailConfirmToken` fields to `users` table
6. After that FE should show warning massage: `A confirmation email was sent to {{ newEmail }}. Your email will not be changed until you confirm!`
7. User follow by email link [GET] `supra.com/frontend-spa/confirm-email?emailConfirmToken=jwt_string...`
8. Front-end show confirm email page
9. FE make request with body `{ emailConfirmToken: jwt_string... }` to [POST] api/users/confirm-email
9. Server validate `emailConfirmToken` (ConfirmEmailAction)
10. Parse `new_email@gmail.com` from `emailConfirmToken` 
11. Updates user data in DB `{ email: 'new_email@gmail.com', newEmail: null, emailConfirmToken: null }`
12. FE display success message: 'Great! New email is applied!'

# Reset password use case
1. User press forgot/reset password
2. User types and send email [POST] api/users/send-reset-email (SendResetPasswordEmailAction):
3. API validate and search email
4. API generate JWT(with user payload data) and send it to user email
5. User click reset password link founded in received email [GET] `supra.com/frontend-spa/reset-password?resetPasswordToken=tokenBody`
6. Front-end show reset password form
7. User types new password and send it with JWT taken from URL [POST] `api/users/reset-password` (ResetPasswordAction)
8. API parses JWT and change user password by id founded in JWT
