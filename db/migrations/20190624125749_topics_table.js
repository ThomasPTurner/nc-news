exports.up = function(knex, Promise) {
  // console.log('creating table: topics')
  return knex.schema.createTable('topics', topicsTable => {
    topicsTable.string('slug').primary().unique().notNullable()
    topicsTable.string('description').notNullable()
  })
  
};

exports.down = function(knex, Promise) {
  // console.log('removing table: topics')
  return knex.schema.dropTableIfExists('topics')
};
