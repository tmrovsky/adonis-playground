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
}

module.exports = UserController
