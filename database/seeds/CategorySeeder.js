'use strict'

/*
|--------------------------------------------------------------------------
| CategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Category = use('App/Models/Category')

class CategorySeeder {
  async run () {
    const categories = [
      'Sport',
      'Science',
      'History'
    ]

    for (const category of categories) {
      await Category.create({
        name: category
      })
    }
  }
}

module.exports = CategorySeeder
