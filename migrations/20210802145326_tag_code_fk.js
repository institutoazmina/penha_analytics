
exports.up = function (knex) {
    return knex.schema.table('analytics', function (table) {
        table.foreign('tag_code').references('tag_code.id');
    });
};

exports.down = function (knex) {
    return knex.schema.table('analytics', function (table) {
        table.dropForeign('tag_code');
    });
};
