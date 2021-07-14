
exports.up = function (knex) {
    return knex.schema.createTable('conversa', function (table) {
        table.bigIncrements('id').primary().unique();
        table.string('handle_hashed').notNullable();
        table.timestamp('started_at', { useTz: true }).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('conversa');
};
