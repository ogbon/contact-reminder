import jwt from 'jsonwebtoken'

require('dotenv').config()

const secret = process.env.SECRET

export const generateJWTToken = data => jwt.sign(data, secret, {expiresIn: '2h'})

export const decodeJWTToken = token => token && jwt.verify(token.split(' ')[1], secret)
