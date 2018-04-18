'use strict'

const Schema = use('Schema')

class AddEmailVerifyFlagToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('email_verified').defaultTo(false).notNullable()
      table.string('verification_hash', 30).unique()
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('email_verified')
      table.dropColumn('verification_hash')
    })
  }
}

module.exports = AddEmailVerifyFlagToUsersSchema
