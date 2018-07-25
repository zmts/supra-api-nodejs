const roles = require('../config').roles

exports.up = (knex, Promise) => {
  return knex.schema
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
    .createTable('posts', table => {
      table.increments()
      table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('title', 20).notNull()
      table.string('content', 5000)

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTable('posts')
    .dropTable('users')
}
