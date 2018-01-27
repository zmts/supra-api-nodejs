class Migration {
  static up(migration) {
    let builder = migration.getBuilder('defaultStore');

    builder.schema.createTable('user', table => {
      table.increments('id').notNullable().primary();
      table.datetime('created_at').notNullable().defaultTo(builder.knex.raw('CURRENT_TIMESTAMP'));
      table.datetime('updated_at').notNullable().defaultTo(builder.knex.raw('CURRENT_TIMESTAMP'));
      table.string('username', 255).notNullable();
      table.string('email', 255).notNullable();
    });
  }

  static down(migration) {
    let builder = migration.getBuilder('defaultStore');

    builder.schema.dropTable('user');
  }
}

module.exports.Migration = Migration;
