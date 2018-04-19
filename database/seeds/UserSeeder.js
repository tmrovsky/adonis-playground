'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class UserSeeder {
  async run () {
    const adminUser = await Factory.model('App/Models/User').make()

    adminUser.merge({
      email: 'admin@desmart.com',
      email_verified: true,
      is_admin: true
    })

    await adminUser.save()

    const nonAdminUser = await Factory.model('App/Models/User').make()

    nonAdminUser.merge({
      email: 'ciunel@desmart.com',
      email_verified: true,
    })

    nonAdminUser.save()
  }
}

module.exports = UserSeeder
