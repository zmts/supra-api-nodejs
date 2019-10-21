exports.up = knex => {
  return knex.schema
    .createTable('posts', table => {
      table.increments()
      table.uuid('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('title', 20).notNull()
      table.string('content', 5000)

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = knex => knex.schema.dropTable('posts')
