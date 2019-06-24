exports.up = function(knex, Promise) {
    console.log('creating table: articles');
    return knex.schema.createTable('articles', articlesTable => {
        articlesTable.increments('id').primary().unique();
        articlesTable.string('title').notNullable();
        articlesTable.string('body', 5000);
        articlesTable.integer('votes').defaultsTo(0);
        articlesTable.string('topic').references('topics.slug').notNullable();
        articlesTable.string('author').references('users.username').notNullable();
        articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex, Promise) {
    console.log('removing table: articles');
    return knex.schema.dropTable('articles');
};