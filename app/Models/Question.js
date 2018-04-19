'use strict'

const Model = require('./BaseModel')

class Question extends Model {
  static boot () {
    super.boot()
  }

  static create (category, data) {
    const model = new Question()
    model.merge({
      ...data,
      category_id: category.id
    })
    return model
  }

  getAnswers (answers) {
    return JSON.parse(answers)
  }
}

module.exports = Question
