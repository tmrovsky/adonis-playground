'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/healthcheck', ({ request }) => {
  return { status: 'App is working' }
})

Route.get('auth', 'AuthController.show')
  .middleware(['auth'])

Route.post('auth', 'AuthController.login')

Route.resource('users', 'UserController')
  .only(['store', 'index'])
  .middleware(new Map([
    [['users.index'], ['auth', 'role:admin']]
  ]))
  .validator(new Map([
    [['users.store'], ['User/Store']]
  ]))

