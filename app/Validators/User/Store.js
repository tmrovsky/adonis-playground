'use strict'

class Store {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required'
    }
  }
}

module.exports = Store
