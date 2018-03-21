'use strict'

const Hash = use('Hash')

const UserHook = module.exports = {}

/**
 * Hash using password as a hook.
 *
 * @method
 *
 * @param  {Object} userInstance
 *
 * @return {void}
 */
UserHook.hashPassword = hashPassword

UserHook.rehashPassword = hashPassword

async function hashPassword (userInstance) {
  if (userInstance.password) {
    userInstance.password = await Hash.make(userInstance.password)
  }
}
