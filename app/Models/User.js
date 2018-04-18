'use strict'

const cryptoRandomString = require('crypto-random-string')

const Model = require('./BaseModel')

class User extends Model {
  static get hidden () {
    return [
      'password',
      "verification_hash"
    ]
  }

  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'UserHook.hashPassword')
    this.addHook('beforeUpdate', 'UserHook.rehashPassword')
  }

  static fromRegistration (email, password) {
    const user = new User()
    user.merge({
      email,
      password,
      verification_hash: this.generateHash()
    })

    return user
  }

  static generateHash () {
    return cryptoRandomString(30)
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
