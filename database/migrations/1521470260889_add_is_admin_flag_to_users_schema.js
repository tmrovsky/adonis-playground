'use strict'

const Schema = use('Schema')

class AddIsAdminFlagToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('is_admin').defaultTo(false).notNullable()
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('is_admin')
    })
  }
}

module.exports = AddIsAdminFlagToUsersSchema
