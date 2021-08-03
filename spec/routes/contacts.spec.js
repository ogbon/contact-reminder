import { expect } from 'chai'
import app from '../../src/app'
import request from 'supertest';
import db from '../../db/models'

const validAdminUser = {
  name: 'Torera',
  email: 'torera@gmail.com',
  password: 'torera'
}

const validUser = {
  name: 'Toreran',
  email: 'toreran@gmail.com',
  password: 'toreran'
}

let token
let adminToken
let adminUser
let user

describe('contacts', () => {
  before( async () => {
    await db.sequelize.sync({ force: true })
  })
  before( async () => {
    const roles = await db.Role.bulkCreate([{name: 'admin'},{name: 'regular'}])
    adminUser = await db.User.create({...validAdminUser,role_id: roles[0].id})
    user = await db.User.create({...validUser,role_id: roles[1].id})
    const res = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'toreran@gmail.com',
          password: 'toreran'
        })
        token = res.body.data.token
      const adminRes = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'torera@gmail.com',
          password: 'torera'
        })
        adminToken = adminRes.body.data.token 

  })
  
  describe('/GET contacts', () => {
    context('invoke index', () => {
      it('return empty array', async () => {
        const res = await request(app)
        .get('/contacts')
        .set("Authorization", `Bearer ${token}`)
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('array')
        expect(res.body.data).to.be.empty
      })
    })
  })
  describe('/POST contacts', () => {
    context('with valid data', () => {
      it('create a contact', async () => {
        const validContact = {
          firstName: "Tola",
          lastName: "Ajadi",
          meetingPlace: "Akure",
          meetingDate: "2021-08-01T23:34:21.421Z",
          purpose: "wedding ceremony"
        }
        const res = await request(app)
          .post('/contacts')
          .set("Authorization", `Bearer ${token}`)
          .send(validContact)
        expect(res.status).to.equal(201)
        expect(res.body).to.have.property('data')
        expect(res.body.data.firstName).to.equal(validContact.firstName)
        expect(res.body.data.lastName).to.equal(validContact.lastName)
        expect(res.body.data.meetingPlace).to.equal(validContact.meetingPlace)
        expect(res.body.data.meetingDate).to.equal(validContact.meetingDate)
        expect(res.body.data.purpose).to.equal(validContact.purpose)
      })
    })
    context('without lastName', () => {
      it('return "lastName" is required', async () => {
        const res = await request(app)
          .post('/contacts')
          .set("Authorization", `Bearer ${token}`)
          .send({
            firstName: "Tola",
            meetingPlace: "Akure",
            meetingDate: "2021-08-01T23:34:21.421Z",
            purpose: "wedding ceremony"
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"lastName" is required')
      })
    })
    context('without firstName', () => {
      it('return "firstName" is required', async () => {
        const res = await request(app)
          .post('/contacts')
          .set("Authorization", `Bearer ${token}`)
          .send({
            lastName: "Ajadi",
            meetingPlace: "Akure",
            meetingDate: "2021-08-01T23:34:21.421Z",
            purpose: "wedding ceremony"
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"firstName" is required')
      })
    })
    context('without meetingPlace', () => {
      it('return "meetingPlace" is required', async () => {
        const res = await request(app)
          .post('/contacts')
          .set("Authorization", `Bearer ${token}`)
          .send({
            firstName: "Tola",
            lastName: "Ajadi",
            meetingDate: "2021-08-01T23:34:21.421Z",
            purpose: "wedding ceremony"
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"meetingPlace" is required')
      })
    })
    context('without purpose', () => {
      it('return "purpose" is required', async () => {
        const res = await request(app)
          .post('/contacts')
          .set("Authorization", `Bearer ${token}`)
          .send({
            firstName: "Tola",
            lastName: "Ajadi",
            meetingPlace: "Akure",
            meetingDate: "2021-08-01T23:34:21.421Z"
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"purpose" is required')
      })
    })
    context('without authentication', () => {
      it('return Please login to your account.', async () => {
        const validContact = {
          firstName: "Tola",
          lastName: "Ajadi",
          meetingPlace: "Akure",
          meetingDate: "2021-08-01T23:34:21.421Z",
          purpose: "wedding ceremony"
        }
        const res = await request(app)
          .post('/contacts')
          .send(validContact)
          expect(res.status).to.equal(401)
          expect(res.body.message).to.equal('Please login to your account.')
      })
    })
  })
  describe('/GET/:id contacts', () => {
    context('with valid id', () => {
      it('get a contact', async () => {
        const validContact = {
          firstName: "Tola",
          lastName: "Ajadi",
          meetingPlace: "Akure",
          meetingDate: "2021-08-01T23:34:21.421Z",
          purpose: "wedding ceremony"
        }
        const contact = await db.Contact.create({...validContact, user_id: user.id})
        const res = await request(app)
          .get(`/contacts/${contact.id}`)
          .set("Authorization", `Bearer ${token}`)
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data.firstName).to.equal(validContact.firstName)
      })
    })
    context('with invalid id', () => {
      it('return Unable to process your request', async () => {
        let id = "au12u"
        const res = await request(app)
          .get(`/contacts/${id}`)
          .set("Authorization", `Bearer ${token}`)
        expect(res.status).to.equal(422)
        expect(res.body.message).to.equal('Unable to process your request.')
      })
    })
  })
  describe('Update contacts', () => {
    context('with valid data', () => {
      it('update a customer', async () => {
        const validContact = {
          firstName: "Denrele",
          lastName: "Ajadi",
          meetingPlace: "Akure",
          meetingDate: "2021-08-01T23:34:21.421Z",
          purpose: "wedding ceremony"
        }
        const contact = await db.Contact.create({...validContact, user_id: user.id})
        const res = await request(app)
          .patch(`/contacts/${contact.id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({meetingPlace: 'Oyo'})
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data.meetingPlace).to.equal('Oyo')
      })
    })
    context('with invalid id', () => {
      it('return Current User cannot view this contact.', async () => {
        let id = 10000
        const res = await request(app)
          .patch(`/contacts/${id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({meetingPlace: 'Ogun'})
        expect(res.status).to.equal(401)
        expect(res.body.message).to.equal('Current User cannot view this contact.')
      })
    })
    context('without Authorization', () => {
      it('return Please login to your account.', async () => {
        const validContact = {
          firstName: "Judas",
          lastName: "Ajadi",
          meetingPlace: "Akure",
          meetingDate: "2021-08-01T23:34:21.421Z",
          purpose: "wedding ceremony"
        }
        const contact = await db.Contact.create({...validContact, user_id: user.id})
        const res = await request(app)
          .patch(`/contacts/${contact.id}`)
          .send({meetingPlace: 'Ogun'})
        expect(res.status).to.equal(401)
        expect(res.body.message).to.equal('Please login to your account.')
      })
    })
  })
  describe('/DELETE/:id contacts', () => {
    context('with valid id', () => {
      it('delete a contact', async () => {
        const validContact = {
          firstName: "Dejo",
          lastName: "Ajadi",
          meetingPlace: "Akure",
          meetingDate: "2021-08-01T23:34:21.421Z",
          purpose: "wedding ceremony"
        }
        const contact = await db.Contact.create({...validContact, user_id: adminUser.id})
        const res = await request(app)
          .delete(`/contacts/${contact.id}`)
          .set("Authorization", `Bearer ${adminToken}`)
          expect(res.status).to.equal(202)
          expect(res.body).to.have.property('data')
          expect(res.body.message).to.equal('Contact removed')
      })
    })
    context('with invalid id', () => {
      it('return Unable to process your request', async () => {
        let id = 100000
        const res = await request(app)
        .delete(`/contacts/${id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.status).to.equal(422)
        expect(res.body.message).to.equal('Unable to process your request.')
      })
    })
  })
})
