'use strict'

const Model = use('Model')

class BaseModel extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'ModelHook.generateId')
  }

  static get hidden () {
    return []
  }

  static make (data) {
    const model = new this()
    model.fill({ ...data })
    return model
  }
}

module.exports = BaseModel
