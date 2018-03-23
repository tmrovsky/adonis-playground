'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UserNotVerifiedException extends LogicalException {
  static invoke (message) {
    return new UserNotVerifiedException(message, 401)
  }
}

module.exports = UserNotVerifiedException
