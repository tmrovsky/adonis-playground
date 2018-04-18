'use strict'

const Schema = use('Schema')

class CategorySchema extends Schema {
  up () {
    this.create('categories', (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategorySchema
