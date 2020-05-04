# Node.js API boilerplate

Piece of my thoughts about Node.js architecture.

[supra-api-nodejs: A little bit about Node.js RESTful APIs Architecture (RU)](https://gist.github.com/zmts/6ac57301e2e8e8e9e059e9c087732c05)

## Highlights:
- Modular RESTful API
- ES6 Classes
- Action based
- SQL based (PostgreSQL with objection.js)
- Migrations(knex.js)
- Auth (JWT/Access-token/Refresh-token)
- Cookie support
- Role based access control
- Request validation
- CRUD(users, posts resources)
- Automated API documentation
- Full authentication/authorization and user registration flow implemented
- Tests(e2e)

## Key points:
### 0. Monolith first
Supra-api-nodejs its about monolith first approach. But this does not prevent you from using it in a microservice architecture as well.

### 1. Controller layer
Each entity have own controller class it slim layer representing resource mapping(routing) 
```
class PostsController extends BaseController {
  static get router () {
    router.get('/', this.actionRunner(actions.ListAction))
    router.get('/:id', this.actionRunner(actions.GetByIdAction))
    router.post('/', this.actionRunner(actions.CreateAction))
    router.patch('/:id', this.actionRunner(actions.UpdateAction))
    router.delete('/:id', this.actionRunner(actions.RemoveAction))

    return router
  }
}
``` 
For example `PostsController` implements `post` entity routes. Each route fires own `action`. 

### 2. Action layer
It's a class encapsulated request validation, permission verification and business logic. One file, one class, one REST operation, one use case.

### 3. DAO layer
Implement data access methods.

### 4. Model layer
Represent models schemas and validation rules. There is no other logic __only model fields and validation rules__.
## Development:

### Install global dependencies:
```
npm i -g knex nodemon
```
### Setup database:
1. Install PostgreSQL (https://postgresapp.com/downloads.html (for Mac OS))
2. Create some DB (https://eggerapps.at/postico/ (for Mac OS))

### Go ahead...
```
cd /supra-api-nodejs
```
- `cp .env.example .env`
- Set required credential in `.env` 

Run migration to set base SQL schema
```
knex migrate:latest
```

Run server
```
npm run start // prod mode
npm run dev // dev mode
```

### Implemented endpoints:

#### /auth
Path | Method | Description
---|---|---
/auth/login | POST | LoginAction
/auth/logout | POST | LogoutAction
/auth/refresh-tokens | POST | RefreshTokensAction

#### /users
Path | Method | Description
---|---|---
/users | GET | ListUsersAction
/users/current | GET | GetCurrentUserAction
/users/:id | GET | GetUserByIdAction
/users | POST | CreateUserAction
/users | PATCH | UpdateUserAction
/users/:id | DELETE | RemoveUserAction
/users/change-password | POST | ChangePasswordAction
/users/send-reset-password-email | POST | SendResetPasswordEmailAction
/users/reset-password | POST | ResetPasswordAction
/users/confirm-registration | POST | ConfirmRegistrationAction
/users/change-email | POST | ChangeEmailAction
/users/confirm-email | POST | ConfirmEmailAction
/users/resend-confirm-new-email-token | POST | ResendConfirmNewEmailTokenAction
/users/cancel-email-changing | POST | CancelEmailChangingAction

#### /posts
Path | Method | Description
---|---|---
/posts | GET | ListPostsAction
/posts | POST | CreatePostAction
/posts/:id | GET | GetPostByIdAction
/posts/:id | PATCH | UpdatePostAction
/posts/:id | DELETE | RemovePostAction

__!!! Project still in progress !!!__

_2017 - 2018 - 2019 - 2020 ..._
