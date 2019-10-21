exports.up = knex => {
  return knex.schema
    .createTable('sessions', table => {
      table.increments()
      table.uuid('userId').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('refreshToken', 36).notNull()
      table.string('ua', 200)
      table.string('fingerprint', 200)
      table.string('ip', 15).notNull()
      table.bigInteger('expiredAt').notNull() // TODO rename to expiresIn

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = knex => knex.schema.dropTable('sessions')
