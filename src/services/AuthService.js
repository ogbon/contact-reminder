/* eslint-disable no-console */
import bcrypt from 'bcrypt'

import DataService from './DataService'
import db from '../../db/models'
import {generateJWTToken} from '../helpers/authTools'
import {
  tokenPayload,
  formatRecord,
  sanitizeUserAttributes,
  addRoleToUser,
} from '../helpers/tools'


class AuthService {
  constructor() {
    this.userService = new DataService(db.User)
  }

  signIn(credentials) {
    const {email, password} = credentials

    return this.userService.show({email}).then(user => {
      if (user) {

        return bcrypt.compare(password, user.password).then(response => {
          if (response)
            return {token: generateJWTToken(tokenPayload(formatRecord(user))), user: sanitizeUserAttributes(formatRecord(user))}
          else
            throw new Error('Email and/or password is incorrect.')
        })
      } else { throw new Error('Email and/or password is incorrect.') }
    })
  }

  async signUp(payload) {
    const userData = await addRoleToUser(payload, 'regular')

    return this.userService.show({email: userData.email}).then(existingUser => {
      if (existingUser) {
        throw new Error('User is already existing')
      } else {
        return this.userService.addResource(userData).then(user => {

          return sanitizeUserAttributes(formatRecord(user))
        })
      }
    })
  }
}

export default AuthService
