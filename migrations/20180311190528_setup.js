exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('users', table => {
      table.increments()
      table.string('username', 25).unique().notNull()
      table.string('name', 50)
      table.string('email', 50).unique().notNull()
      table.string('role').defaultTo('user').notNull()

      table.text('passwordHash').notNull()
      table.jsonb('refreshTokensMap').defaultTo('{}')
      table.text('resetToken')

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
