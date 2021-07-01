
exports.up = function (knex) {
    return knex.schema.createTable('step_code', function (table) {
        table.increments();
        table.integer('questionnaire_id');
        table.string('code').notNullable();
        table.integer('json_version_code').notNullable();
        table.timestamps();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('step_code');
};
