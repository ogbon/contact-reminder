import express from 'express'

import permissions from '../middlewares/permissions'
import contactController from '../controllers/contact'

const users = express.Router()

users.route('/contacts')
  .get(permissions.isAdmin, contactController.fetchContacts)

export default users 
