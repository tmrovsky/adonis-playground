const User = use('App/Models/User')

class UserController {
  async index ({ response }) {
    const users = await User.all()

    return response.json(users)
  }

  async store ({ request, response }) {
    const { email, password } = request.all()
    const user = User.fromRegistration(email, password)
    await user.save()

    return response.status(201).json(user)
  }

  async verifyEmail ({ request }) {
    const hash = request.input('hash')

    const user = await User.query()
      .where({ verification_hash: hash })
      .first()

    user.merge({
      verification_hash: null,
      email_verified: true
    })

    await user.save()
  }
}

module.exports = UserController
