exports.up = function(knex, Promise) {
    // console.log('creating table: users');
    return knex.schema.createTable('users', usersTable => {
        usersTable.string('username', 20).primary().unique().notNullable();
        usersTable.string('avatar_url').notNullable()
        usersTable.string('name').notNullable()
    })
};

exports.down = function(knex, Promise) {
    // console.log('removing table: users');
    return knex.schema.dropTableIfExists('users');
};
