'use strict'

const GE = require('@adonisjs/generic-exceptions')

class RoleAuth {
  async handle ({ request, auth }, next) {
    // call next to advance the request
    if (auth.user.is_admin) {
      await next()
    } else {
      throw new GE.LogicalException('Unauthorized', 401)
    }
  }
}

module.exports = RoleAuth
