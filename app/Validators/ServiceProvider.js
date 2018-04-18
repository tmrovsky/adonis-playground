const { ServiceProvider: BaseProvider } = require('@adonisjs/fold')

class ServiceProvider extends BaseProvider {
  boot () {
    const Validator = use('Validator')
    const ExistsRule = require('./Rule/Exists')

    Validator.extend('exists', ExistsRule)
  }
}

module.exports = ServiceProvider
