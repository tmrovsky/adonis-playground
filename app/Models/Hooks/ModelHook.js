'use strict'

const uuidv4 = require('uuid/v4')

const ModelHook = exports = module.exports = {}

ModelHook.generateId = async modelInstance => {
  if (!modelInstance.id) {
    modelInstance.id = uuidv4()
  }
}
