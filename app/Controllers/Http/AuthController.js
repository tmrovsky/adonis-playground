const AuthExceptions = require('@adonisjs/auth/src/Exceptions')

const User = use('App/Models/User')
const Hash = use('Hash')

class AuthController {
  async login ({ request, auth }) {
    const { email, password } = request.all()

    const user = await User.findBy('email', email)

    if (!user) {
      throw AuthExceptions.UserNotFoundException.invoke(`Cannot find user with email as ${email}`, 'email', 'password', 'jwt')
    }

    if (!await Hash.verify(password, user.password)) {
      throw AuthExceptions.PasswordMisMatchException.invoke('Cannot verify user password', 'password', 'jwt')
    }

    return auth.generate(user)
  }

  show ({ auth }) {
    return auth.getUser()
  }
}

module.exports = AuthController
