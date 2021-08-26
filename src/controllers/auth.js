import * as Promise from 'bluebird'

import AuthService from '../services/AuthService'
import {UNAUTHORIZED, CREATED, UNPROCESSABLE_ENTITY, OK} from '../constants/statusCodes'

const authService = new AuthService()

const authController = {
  signIn: (req, res) => {
    Promise.try(() => authService.signIn(req.body)).then(({token, user}) => {
      res.status(OK).send({data: {token, user}, message: 'Login successful', success: true})
    }).catch((err) => {
      res.status(UNAUTHORIZED).send({data: null, message: 'Email and/or password is incorrect.', success: false})
    })
  },

  signUp: (req, res) => {
    Promise.try(() => authService.signUp(req.body))
      .then(data => res.status(CREATED).send({data, message: 'Sign Up successful', success: true}))
      .catch((err) => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to process your request',
        success: false
      }))
  }

}

export default authController
