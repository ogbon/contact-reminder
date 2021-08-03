import { expect } from 'chai'
import app from '../../src/app'
import request from 'supertest';
import db from '../../db/models'


const validUser = {
  name: 'Torera',
  email: 'torera@gmail.com',
  password: 'torera'
}


describe('auth', () => {
  before( async () => {
    await db.sequelize.sync({ force: true })
  })
  before( async () => {
    const roles = await db.Role.bulkCreate([{name: 'admin'},{name: 'regular'}])    
  })
  
  describe('/POST auth/sign-up', () => {
    context('with valid data', () => {
      it('create a user', async () => {
        const res = await request(app)
          .post('/auth/sign-up')
          .send(validUser)  
        expect(res.status).to.equal(201)
        expect(res.body).to.have.property('data')
        expect(res.body.data.name).to.equal(validUser.name)
        expect(res.body.data.email).to.equal(validUser.email)
      })
    })
    context('without name', () => {
      it('return "name" is required', async () => {
        const res = await request(app)
          .post('/auth/sign-up')
          .send({
            email: 'torera@gmail.com',
            password: 'torera'
          })
        expect(res.status).to.equal(422)
        expect(res.body.error).to.equal('"name" is required')
      })
    })
    context('without email', () => {
        it('return "email" is required', async () => {
          const res = await request(app)
            .post('/auth/sign-up')
            .send({
              name: 'Torera',
              password: 'torera'
            })
          expect(res.status).to.equal(422)
          expect(res.body.error).to.equal('"email" is required')
        })
    })
    context('without password', () => {
        it('return "password" is required', async () => {
          const res = await request(app)
            .post('/auth/sign-up')
            .send({
              email: 'torera@gmail.com',
              name: 'Torera'
            })
          expect(res.status).to.equal(422)
          expect(res.body.error).to.equal('"password" is required')
        })
    })
  })
  describe('/POST auth/sign-in', () => {
    context('with valid data', () => {
      it('create a user', async () => {
        const res = await request(app)
          .post('/auth/sign-in')
          .send({email: 'torera@gmail.com', password: 'torera'})
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data.user.name).to.equal(validUser.name)
        expect(res.body.data.user.email).to.equal(validUser.email)
        expect(res.body.data).to.have.property('token')
      })
    })
    context('without email', () => {
        it('return "email" is required', async () => {
          const res = await request(app)
            .post('/auth/sign-in')
            .send({
              password: 'torera'
            })
          expect(res.status).to.equal(422)
          expect(res.body.error).to.equal('"email" is required')
        })
    })
    context('without password', () => {
        it('return "password" is required', async () => {
          const res = await request(app)
            .post('/auth/sign-in')
            .send({
              email: 'torera@gmail.com'
            })
          expect(res.status).to.equal(422)
          expect(res.body.error).to.equal('"password" is required')
        })
    })
  })
})
