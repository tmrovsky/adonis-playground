const chai = require('chai')
const { expect } = chai

const Database = use('Database')
const Question = use('App/Models/Question')
const Category = use('App/Models/Category')

const { test, trait, before, after } = use('Test/Suite')('Question')

trait('Test/ApiClient')
trait('Auth/Client')

let question

const createQuestion = async () => {
  const sportCategory = await Database.from('categories').where({ name: 'Sport' }).first()

  const question = Question.create(sportCategory, {
    question: 'Who won the World Cup in 2014?',
    answers: JSON.stringify([{
      answer: 'Spain',
      correct: false
    }, {
      answer: 'Germany',
      correct: true
    }, {
      answer: 'Argentina',
      correct: false
    }, {
      answer: 'Brazil',
      correct: false
    }])
  })

  await question.save()

  return question
}

before(async () => {
  question = await createQuestion()
})

after(async () => {
  await question.delete()

})

test('model | toJSON called | answers field should be an array', async () => {
  const parsedQuestion = question.toJSON()
  expect(parsedQuestion.answers).to.be.an('array')
})

test('model | toJSON not called | answers field should be a string', async () => {
  expect(question.answers).to.be.a('string')
})
