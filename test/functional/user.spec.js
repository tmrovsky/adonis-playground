const chai = require('chai')
const { expect } = chai
const uuidv4 = require('uuid/v4')
const cryptoRandomString = require('crypto-random-string')

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
  adminUser.merge({
    id: uuidv4(),
    email: 'testadmin@desmart.com',
    password: 'some-password',
    is_admin: true,
    verification_hash: cryptoRandomString(30)
  })
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
  expect(nonAdminUserData).to.have.property('verification_hash')

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

test('verifyEmail', async ({ client }) => {
  await client
    .post('/users/verify-email')
    .send({ hash: nonAdminUser.verification_hash })
    .end()

  const user = await User.find(nonAdminUser.id)

  expect(user.email_verified).to.equal(true)
  expect(user.verification_hash).to.equal(null)
})

test('verifyEmail | 400 if email already verified', async ({ client }) => {
  const response = await client
    .post('/users/verify-email')
    .send({ hash: nonAdminUser.verification_hash })
    .end()

  response.assertStatus(400)
})

test('verifyEmail | 400 no hash in body', async ({ client }) => {
  const response = await client
    .post('/users/verify-email')
    .send({ verification_hash: adminUser.verification_hash })
    .end()

  response.assertStatus(400)
})

test('verifyEmail | 400 wrong hash', async ({ client }) => {
  const response = await client
    .post('/users/verify-email')
    .send({ hash: '123412341234' })
    .end()

  response.assertStatus(400)
})
