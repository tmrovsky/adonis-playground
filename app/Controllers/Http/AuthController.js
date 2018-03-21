const AuthExceptions = require('@adonisjs/auth/src/Exceptions')
const { ValidationException } = require('@adonisjs/validator/src/Exceptions')

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

  async update ({ request, response, auth }) {
    const user = await auth.getUser()
    const data = request.post()

    if ('email' in data) {
      await this._verifyEmailIsUnique(user.id, data.email)
    }

    user.merge(data)
    await user.save()

    response.status(204)
  }

  async _verifyEmailIsUnique (userId, email) {
    const user = await User
      .query()
      .where({ email })
      .whereNot({ id: userId })
      .first()

    if (user) {
      throw ValidationException.validationFailed([
        {
          field: 'email',
          validation: 'unique'
        }
      ])
    }
  }
}

module.exports = AuthController
