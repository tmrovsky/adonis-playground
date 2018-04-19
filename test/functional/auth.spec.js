const chai = require('chai')
const { expect } = chai

const Database = use('Database')
const User = use('App/Models/User')

const { test, trait, before, after } = use('Test/Suite')('Auth')

trait('Test/ApiClient')
trait('Auth/Client')

let user
let user2

before(async () => {
  const userData = {
    email: 'test@desmart.com',
    password: 'some-super-fancy-password',
    email_verified: true
  }

  const user2Data = {
    email: 'test2@desmart.com',
    password: 'some-super-fancy-password',
    email_verified: false
  }

  user = await User.create(userData)
  user2 = await User.create(user2Data)
})

after(async () => {
  await user.delete()
  await user2.delete()
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

test('login | reject user with non verified email', async ({ client }) => {
  const response = await client
    .post('auth')
    .send({ email: 'test2@desmart.com', password: 'some-super-fancy-password' })
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

test('update | 200 authenticated user', async ({ client }) => {
  const response = await client
    .patch('auth')
    .send({ email: 'test+updated@desmart.com' })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)

  const updatedUser = await Database.table('users').where({ email: 'test+updated@desmart.com' })
  expect(updatedUser).to.not.be.empty
})

test('update | 401 not authenticated user', async ({ client }) => {
  const response = await client
    .patch('auth')
    .send({ email: 'test@desmart.com' })
    .end()

  response.assertStatus(401)
})

test('update | 400 change email to existing', async ({ client }) => {
  const response = await client
    .patch('auth')
    .send({ email: user2.email })
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(400)
})
