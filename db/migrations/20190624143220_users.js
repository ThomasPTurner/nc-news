exports.up = function(knex, Promise) {
    console.log('creating table: users');
    return knex.schema.createTable('users', usersTable => {
        usersTable.string('username').primary().unique().notNullable();
        usersTable.string('avatar_url')
        usersTable.string('name')
    })
};

exports.down = function(knex, Promise) {
    console.log('removing table: users');
    return knex.schema.dropTable('users');
};
