# Change email use case

## First step: [POST] '/users/change-email' (ChangeEmailAction)
1. FE send body `{ email: 'new_email@gmail.com' }`
2. Server check is email already exist in DB if exist throw error
3. Generate `emailConfirmToken` (jwt)
4. Sends token to new email (`To confirm email: ${newEmail} please follow this link >> supra.com/users/confirm-email?emailConfirmToken=${emailConfirmToken}`)
5. Stores `newEmail` and `emailConfirmToken` fields to `users` table
6. After that FE should show warning massage: `A confirmation email was sent to {{ newEmail }}. Your email will not be changed until you confirm!`

## Second step: [GET] '/users/confirm-email' (ConfirmEmailAction)
User should confirm new email by clicking link in email
1. User follow by email link `supra.com/frontend-spa/confirm-email?emailConfirmToken=jwt_string...`
2. FE make request with body `{ emailConfirmToken: jwt_string... }`
3. Server validate `emailConfirmToken`
4. Parse `new_email@gmail.com` from `emailConfirmToken` 
5. Updates user data in DB `{ email: 'new_email@gmail.com', newEmail: null, emailConfirmToken: null }`
6. FE display success message: 'Great! New email is applied!'
