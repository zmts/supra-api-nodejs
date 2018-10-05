# Node.js API boilerplate

Piece of my thoughts about Node.js architecture.

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
1. Routing.
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

2. Action.
It's a class that encapsulated request validation, permission verification and business logic. One file, one class, one REST operation.

3. Service.
It's much more like utility layer thats provide some helpful promisfitated functions like check access, hash password or generate jwt's.

4. DAO.
Implement data access methods.

### Implemented endpoints:
![endpoints](https://i.imgur.com/GCW47z5.png)

__!!! Project still in progress !!!__

_2017 - ..._
