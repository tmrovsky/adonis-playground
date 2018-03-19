const chai = require('chai')
const uuidv4 = require('uuid/v4')
const { expect } = chai

const Factory = use('Factory')
const Hash = use('Hash')
const User = use('App/Models/User')

const { test, trait, before, after } = use('Test/Suite')('Auth')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

let user

before(async () => {
  const userData = {
    email: 'test@desmart.com',
    password: 'some-super-fancy-password',
    id: uuidv4()
  }

  user = await User.create(userData)
})

after(async () => {
  await user.delete()
})

test('login', async ({ client }) => {
  const response = await client
    .post('auth')
    .send({ email: 'test@desmart.com', password: 'some-super-fancy-password' })
    .end()

  response.assertStatus(200)

  expect(response.body).to.have.property('token')
  expect(response.body).to.have.property('type', 'bearer')
})

test('login | reject user not found', async ({ client }) => {
  const response = await client
    .post('auth')
    .send({ email: 'not-registered@desmart.com', password: 'some-password' })
    .end()

  response.assertStatus(401)
})

test('login | reject wrong password', async ({ client }) => {
  const response = await client
    .post('auth')
    .send({ email: 'test@desmart.com', password: 'some-password' })
    .end()

  response.assertStatus(401)
})

