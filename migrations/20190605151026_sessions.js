exports.up = (knex, Promise) => {
  return knex.schema
    .createTable('sessions', table => {
      table.uuid('id', 36).unsigned().primary().notNull().defaultTo(knex.raw('uuid_generate_v4()'))
      table.integer('userId').references('id').inTable('users').onDelete('CASCADE')
      table.string('os', 200).notNull()
      table.string('ua', 200)
      table.string('browser', 500)
      table.string('fingerprint', 200)
      table.string('ip', 15).notNull()

      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNull()
      table.timestamp('updatedAt').defaultTo(knex.fn.now()).notNull()
    })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('sessions')
}
