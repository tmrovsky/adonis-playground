'use strict'

/*
|--------------------------------------------------------------------------
| QuestionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Database = use('Database')
const Question = use('App/Models/Question')

class QuestionSeeder {
  async run () {
    const sportCategory = await Database.from('categories').where({ name: 'Sport' }).first()

    const question = Question.create(sportCategory, {
      question: 'Which country is a host of World Cup 2018 in football?',
      answers: JSON.stringify([{
        answer: 'France',
        correct: false
      }, {
        answer: 'Japan',
        correct: false
      }, {
        answer: 'Russia',
        correct: true
      }, {
        answer: 'Spain',
        correct: false
      }])
    })

    await question.save()
  }
}

module.exports = QuestionSeeder
