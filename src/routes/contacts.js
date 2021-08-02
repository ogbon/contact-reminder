import express from 'express'

import permissions from '../middlewares/permissions'
import contactController from '../controllers/contact'
import schemas from '../helpers/schemas'
import validators from '../middlewares/validators'

const contacts = express.Router()

contacts.route('/')
  .post(permissions.isAuthenticated, validators.requestSchema(schemas.contact.create, 'body'), contactController.create)
  .get(permissions.isAuthenticated, contactController.index)

contacts.route('/:id')
  .patch(permissions.isAuthenticated, validators.requestSchema(schemas.contact.update, 'body'), contactController.update)
  .delete(permissions.isAdmin, contactController.remove)
  .get(permissions.isAuthenticated, contactController.show)

export default contacts
