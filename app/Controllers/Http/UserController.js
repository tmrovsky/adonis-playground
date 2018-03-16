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

  async show ({ params, response }) {
    const user = await User.find(params.id)
    return response.json(user)
  }

  async delete ({ params, response }) {
    const user = await User.find(params.id)
    if (!user) {
      return response.status(404).json(null)
    }

    await user.delete()

    return response.status(204).json(null)
  }
}

module.exports = UserController
