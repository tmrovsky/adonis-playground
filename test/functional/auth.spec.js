const chai = require('chai')
const uuidv4 = require('uuid/v4')
const { expect } = chai

const User = use('App/Models/User')

const { test, trait, before, after } = use('Test/Suite')('Auth')

trait('Test/ApiClient')
trait('Auth/Client')

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
    .post('/auth')
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

test('login | reject user with wrong password', async ({ client }) => {
  const response = await client
    .post('auth')
    .send({ email: 'test@desmart.com', password: 'some-password' })
    .end()

  response.assertStatus(401)
})

test('show | 200 authenticated user', async ({ client }) => {
  const response = await client
    .get('auth')
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)

  expect(response.body.email).to.equal('test@desmart.com')
})

test('show | 401 not authenticated user', async ({ client }) => {
  const response = await client
    .get('auth')
    .end()

  response.assertStatus(401)
})
