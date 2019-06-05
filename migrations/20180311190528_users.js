const roles = require('../config').roles

exports.up = (knex, Promise) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('users', table => {
      table.increments()
      table.string('username', 25).unique().notNull()
      table.string('name', 50)
      table.string('role').defaultTo(roles.user).notNull()
      table.string('email', 50).unique().notNull()
      table.boolean('isEmailConfirmed').defaultTo(false)
      table.text('emailConfirmToken')

      table.text('passwordHash').notNull()
      table.jsonb('refreshTokensMap').defaultTo('{}')
      table.text('resetEmailToken')

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users').then(() => knex.raw('drop extension if exists "uuid-ossp"'))
}
