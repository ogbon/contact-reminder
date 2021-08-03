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

describe('users', () => {
  before( async () => {
    await db.sequelize.sync({ force: true })
  })
  before( async () => {
    const roles = await db.Role.bulkCreate([{name: 'admin'},{name: 'regular'}])
    await db.User.create({...validAdminUser,role_id: roles[0].id})
    await db.User.create({...validUser,role_id: roles[1].id})
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
  
  describe('/GET users/contacts', () => {
    context('invoke fetchContacts', () => {
      it('return empty array', async () => {
        const res = await request(app)
        .get('/users/contacts')
        .set("Authorization", `Bearer ${adminToken}`)
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.a('array')
        expect(res.body.data).to.be.empty
      })
    })
    context('invoke fetchContacts without Authorization', () => {
        it('return Current user is unauthorized', async () => {
          const res = await request(app)
          .get('/users/contacts')
          expect(res.status).to.equal(401)
          expect(res.body.message).to.equal('Current user is unauthorized')
        })
    })
    context('invoke fetchContacts with regular Authorization', () => {
        it('return Current user is unauthorized', async () => {
          const res = await request(app)
          .get('/users/contacts')
          .set("Authorization", `Bearer ${token}`)
          expect(res.status).to.equal(401)
          expect(res.body.message).to.equal('Current user is unauthorized')
        })
    })
  })
})  