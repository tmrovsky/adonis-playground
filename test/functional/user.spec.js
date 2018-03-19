const chai = require('chai')
const { expect } = chai

const Database = use('Database')
const Hash = use('Hash')
const User = use('App/Models/User')

const { test, trait, after } = use('Test/Suite')('User')

trait('Test/ApiClient')
trait('Auth/Client')

let user

after(async () => {
  const addedUser = await User.find(user.id)
  await addedUser.delete()
})

test('store', async ({ client }) => {
  const payload = {
    email: 'test@desmart.com',
    password: 'super-fancy-password'
  }

  const response = await client
    .post('/users')
    .send(payload)
    .end()

  response.assertStatus(201)

  user = await Database.table('users').where({ email: payload.email }).first()

  expect(user.email).to.equal(payload.email)
  expect(user.password).not.to.equal(payload.password)

  expect(await Hash.verify(payload.password, user.password)).to.equal(true)
})
