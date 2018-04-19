'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const faker = require('faker')
const Factory = use('Factory')

Factory.blueprint('App/Models/User', () => {
  return {
    email: faker.internet.email(),
    password: '123qwe',
    email_verified: false
  }
})

