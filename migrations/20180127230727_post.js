class Migration {
  static up(migration) {
    let builder = migration.getBuilder('defaultStore');

    builder.schema.createTable('post', table => {
      table.increments('id').notNullable().primary();
      table.datetime('created_at').notNullable().defaultTo(builder.knex.raw('CURRENT_TIMESTAMP'));
      table.datetime('updated_at').notNullable().defaultTo(builder.knex.raw('CURRENT_TIMESTAMP'));
      table.string('title', 255).notNullable();
      table.string('content', 255).notNullable();
    });
  }

  static down(migration) {
    let builder = migration.getBuilder('defaultStore');

    builder.schema.dropTable('post');
  }
}

module.exports.Migration = Migration;
