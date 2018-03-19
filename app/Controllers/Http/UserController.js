const User = use('App/Models/User')

const uuidv4 = require('uuid/v4')

class UserController {
  async index ({ response }) {
    const users = await User.all()

    return response.json(users)
  }

  async store ({ request, response }) {
    const { email, password } = request.all()
    const user = new User()
    user.merge({ email, password, id: uuidv4() })
    await user.save()

    return response.status(201).json(user)
  }
}

module.exports = UserController
