import * as Promise from 'bluebird'

import ContactService from '../services/ContactService'
import {CREATED, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED, ACCEPTED} from '../constants/statusCodes'
import {pagination, totalPage} from '../helpers/tools'

const contacts = {
  create: (req, res) => {
    const contactService = new ContactService(req.decoded)

    Promise.try(() => contactService.add(req.body))
      .then(([newContact]) => res.status(CREATED).send({data: newContact, message: null, success: true}))
      .catch((err) => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to complete your request at the moment, please confirm that you do not have missing required fields.',
        success: false
      }))
  },
  index: (req, res) => {
    const contactService = new ContactService(req.decoded)

    Promise.try(() => contactService.find())
      .then(contacts => res.status(OK).send({data: contacts, message: null, success: true}))
      .catch(() => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to complete your request at the moment.',
        success: false
      }))
  },
  show: (req, res) => {
    const contactService = new ContactService(req.decoded)

    Promise.try(() => contactService.get(req.params.id))
      .then(contact => res.status(OK).send({data: contact, message: null, success: true}))
      .catch((err) => {
        if (err.message === 'Current User cannot view this contact.')
          res.status(UNAUTHORIZED).send({data: null, message: err.message, success: false})
        else
          res.status(UNPROCESSABLE_ENTITY).send({data: null, message: 'Unable to process your request.', success: false})
      })
  },
  update: (req, res) => {
    const contactService = new ContactService(req.decoded)

    Promise.try(() => contactService.update(req.params.id, req.body))
      .then(updatedContact => res.status(OK).send({data: updatedContact, message: null, success: true}))
      .catch(err => {
        if (err.message === 'Current User cannot view this contact.')
          res.status(UNAUTHORIZED).send({data: null, message: err.message, success: false})
        else
          res.status(UNPROCESSABLE_ENTITY).send({data: null, message: 'Unable to process your request.', success: false})
      })
  },

  remove: (req, res) => {
    const contactService = new ContactService()

    Promise.try(() => contactService.remove(req.params.id))
      .then(() => res.status(ACCEPTED).send({data: null, message: 'Contact removed', success: true}))
      .catch(err => {
          res.status(UNPROCESSABLE_ENTITY).send({data: null, message: 'Unable to process your request.', success: false})
      })
  },

  fetchContacts: (req, res) => {
    const contactService = new ContactService()
    const {page} = req.query

    Promise.try(() => contactService.fetchContacts({...pagination(page)}))
      .then(({count,rows}) => res.status(OK).send({
        count,
        data: rows,
        currentPage: parseInt(page && page.number, 10) || 1,
        totalPage: totalPage(count, (page && page.size)),
        message: null,
        success: true
      }))
      .catch(() => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to complete your request at the moment.',
        success: false
      }))
  }
}

export default contacts
