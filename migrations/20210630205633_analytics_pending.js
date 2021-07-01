
exports.up = function (knex) {
    return knex.schema.createTable('analytics_pending_timeout', function (table) {
        table.bigInteger('analytics_id').primary().references('analytics.id');
        table.timestamp('wait_until', { useTz: true }).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('analytics_pending_timeout');
};
