const chai = require('chai')
const { expect } = chai
const uuidv4 = require('uuid/v4')

const Database = use('Database')
const Hash = use('Hash')
const User = use('App/Models/User')

const { test, trait, before, after } = use('Test/Suite')('User')

trait('Test/ApiClient')
trait('Auth/Client')

let adminUser
let nonAdminUser

before(async () => {
  adminUser = new User()
  adminUser.merge({ id: uuidv4(), email: 'testadmin@desmart.com', password: 'some-password', is_admin: true })
  await adminUser.save()
})

after(async () => {
  await nonAdminUser.delete()
  await adminUser.delete()
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

  nonAdminUser = await User.find(response.body.id)
  const nonAdminUserData = await Database.table('users').where({ email: payload.email }).first()

  expect(nonAdminUserData.email).to.equal(payload.email)
  expect(nonAdminUserData.password).not.to.equal(payload.password)

  expect(await Hash.verify(payload.password, nonAdminUser.password)).to.equal(true)
})

test('store | 400 user with same email', async ({ client }) => {
  const response = await client
    .post('/users')
    .send({ email: 'test@desmart.com', password: 'some-password' })
    .end()

  response.assertStatus(400)
})

test('index | 200 authenticated user with admin role', async ({ client }) => {
  const response = await client
    .get('/users')
    .loginVia(adminUser, 'jwt')
    .end()

  response.assertStatus(200)
})

test('index | 401 authenticated user with non-admin role', async ({ client }) => {
  const response = await client
    .get('/users')
    .loginVia(nonAdminUser, 'jwt')
    .end()

  response.assertStatus(401)
})

test('index | 401 not authenticated user', async ({ client }) => {
  const response = await client
    .get('/users')
    .end()

  response.assertStatus(401)
})
