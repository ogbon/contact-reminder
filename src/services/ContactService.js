import db from '../../db/models'
import DataService from './DataService'

class ContactService extends DataService {
  constructor(currentUser = {}) {
    super(db.Contact)

    this.currentUser = currentUser
  }

  add(payload) {
    const contactPayload = {...payload, user_id: this.currentUser.id}
    return this.model.findOrCreate({where: {firstName: contactPayload.firstName, user_id: contactPayload.user_id}, defaults: contactPayload})
  }

  get(id) {
    return this.show({id, user_id: this.currentUser.id}).then(contact => {
      if (contact)
        return contact
      else
        throw new Error('Current User cannot view this contact.')
    })
  }

  update(id, payload) {
    return this.show({id, user_id: this.currentUser.id}).then(contact => {
      if (contact)
        return contact.update(payload)
      else
        throw new Error('Current User cannot view this contact.')
    })
  }

  remove(id) {
    return this.show({id}).then(contact => {
      if (contact)
        return contact.destroy()
      else
        throw new Error('Invalid contact id.')
    })
  }

  find() { return this.index({where: {user_id: this.currentUser.id}}) }

  fetchContacts({limit, offset}) {
    return this.paginatedIndex({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })
  }
}

export default ContactService
