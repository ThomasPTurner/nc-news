exports.up = function(knex, Promise) {
    console.log('creating table: comments');
    return knex.schema.createTable('comments', commentsTable => {
        commentsTable.increments('id').primary().unique().notNullable();
        commentsTable.string('author').references('users.username').notNullable();
        commentsTable.integer('article_id').references('articles.id').notNullable();
        commentsTable.integer('votes').defaultsTo(0).notNullable();
        commentsTable.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6)).notNullable();
        commentsTable.string('body', 5000);
    })
};

exports.down = function(knex, Promise) {
    console.log('removing table: comments');
    return knex.schema.dropTable('comments');
};