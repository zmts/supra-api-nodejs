const roles = require('../permissions/roles')

exports.up = knex => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('users', table => {
      table.uuid('id', 36).unsigned().primary().notNull().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('username', 25).unique().notNull()
      table.string('name', 50)
      table.string('role').defaultTo(roles.user).notNull()
      table.string('email', 50).unique().notNull()
      table.string('newEmail', 50).unique()
      table.string('location', 300)
      table.text('emailConfirmToken')
      table.boolean('isConfirmedRegistration').defaultTo(false).notNull()

      table.text('passwordHash').notNull()
      table.text('resetPasswordToken')

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = knex => {
  return knex.schema.dropTable('users').then(() => knex.raw('drop extension if exists "uuid-ossp"'))
}
