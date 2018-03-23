'use strict'

class VerifyEmail {
  get rules () {
    return {
      hash: 'required|exists:users,verification_hash'
    }
  }
}

module.exports = VerifyEmail
