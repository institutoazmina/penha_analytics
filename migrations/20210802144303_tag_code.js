
exports.up = function (knex) {
    return knex.schema.createTable('tag_code', function (table) {
        table.increments();
        table.string('label').notNullable();
    }).then(function () {
        return knex('tag_code').insert([
            { id: 0, label: 'Sem categoria' },
            { id: 1, label: 'Em busca de info. sobre relacionamento abusivo para ela' },
            { id: 2, label: 'Em busca de info. sobre relacionamento abusivo para outra pessoa' },
            { id: 3, label: 'Está em relacionamento abusivo' }
        ])
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tag_code');
};
