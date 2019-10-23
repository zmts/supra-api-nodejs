# Node.js API boilerplate

Piece of my thoughts about Node.js architecture.

[supra-api-nodejs: A little bit about Node.js RESTful APIs Architecture (RU)](https://gist.github.com/zmts/6ac57301e2e8e8e9e059e9c087732c05)

## Highlights:
- RESTful API
- ES6 Classes
- Action based
- Service based
- SQL based (PostgreSQL with objection.js)
- Migrations(knex.js)
- Auth (JWT/Access-token/Refresh-token)
- Role based access control
- Request validation (Joi.js)
- CRUD(users, posts resources)
- Automated API documentation

## Key points:
### 0. Monolith first
Supra-api-nodejs its about monolith first approach.

### 1. Routing
Each entity have own router class that implement RESTful interface to work with it.
```
class PostsRouter extends BaseRouter {
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
For example `PostsRouter` implement base CRUD routes to `post` entity. Each route fires own `action`. 

### 2. Action
It's a class that encapsulated request validation, permission verification and business logic. One file, one class, one REST operation.

### 3. Service
It's much more like utility layer thats provide some helpful promisfitated functions like check access, hash password or generate jwt's.

### 4. DAO
Implement data access methods.

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
/users/send-email-confirm-token | POST | SendEmailConfirmTokenAction
/users/cancel-email-changing | POST | CancelEmailChangingAction

#### /posts
Path | Method | Description
---|---|---
/posts | GET | ListPostsAction
/posts | POST | GetPostByIdAction
/posts/:id | GET | CreatePostAction
/posts/:id | PATCH | UpdatePostAction
/posts/:id | DELETE | RemovePostAction

__!!! Project still in progress !!!__

_2017 - 2018 - 2019 ..._
