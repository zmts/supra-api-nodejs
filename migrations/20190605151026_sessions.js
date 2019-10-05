exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('sessions', table => {
      table.increments()
      table.uuid('userId').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('refreshToken', 36).notNull()
      table.string('os', 200)
      table.string('ua', 200)
      table.string('browser', 500)
      table.string('fingerprint', 200)
      table.string('ip', 15).notNull()
      table.bigInteger('expiredAt').notNull()

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = (knex, Promise) => knex.schema.dropTable('sessions')
