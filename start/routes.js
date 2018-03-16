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

Route.group(() => {
  Route.get('users', 'UserController.index')
  Route.post('users', 'UserController.store')
  Route.get('users/:id', 'UserController.show')
  Route.delete('users/:id', 'UserController.delete')
})

