'use strict'

const Schema = use('Schema')

class QuestionSchema extends Schema {
  up () {
    this.create('questions', (table) => {
      table.uuid('id').primary()
      table.string('question').notNullable()
      table.uuid('category_id').references('id').inTable('categories').onDelete('cascade').notNullable()
      table.json('answers').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('questions')
  }
}

module.exports = QuestionSchema
