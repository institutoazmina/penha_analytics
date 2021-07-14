
exports.up = function (knex) {
    return knex.schema.createTable('analytics', function (table) {
        table.increments();
        table.bigInteger('conversa_id').notNullable().references('conversa.id');
        table.integer('step_code_id').notNullable().references('step_code.id');
        table.integer('previous_step_code_id').references('step_code.id');
        table.enum('state', ['DURING_DECISION_TREE', 'DURING_QUESTIONNAIRE', 'QUESTIONNAIRE_FINISHED', 'QUESTIONNAIRE_TIMEOUT', 'QUESTIONNAIRE_GAVE_UP', 'QUESTIONNAIRE_RESET'], { useNative: true, enumName: 'finished_type' });
        table.integer('tag_code').notNullable().defaultTo(0);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('first_msg_tz', { useTz: true }).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('analytics');
};
