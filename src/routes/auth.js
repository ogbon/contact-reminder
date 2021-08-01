import express from 'express'

import authController from '../controllers/auth'
import schemas from '../helpers/schemas'
import validators from '../middlewares/validators'

const auth = express.Router()

auth.route('/sign-in')
  .post(validators.requestSchema(schemas.auth.signIn, 'body'), authController.signIn)

auth.route('/sign-up')
  .post(validators.requestSchema(schemas.auth.signUp, 'body'), authController.signUp)

export default auth
