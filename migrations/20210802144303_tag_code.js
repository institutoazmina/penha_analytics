
exports.up = function (knex) {
    return knex.schema.createTable('tag_code', function (table) {
        table.increments();
        table.string('label').notNullable();
    }).then(function () {
        return knex('tag_code').insert([
            { label: 'Sem categoria' },
            { label: 'Em busca de info. sobre relacionamento abusivo para ela' },
            { label: 'Em busca de info. sobre relacionamento abusivo para outra pessoa' },
            { label: 'Está em relacionamento abusivo' }
        ])
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tag_code');
};
