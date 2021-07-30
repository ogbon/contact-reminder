import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

// Express application configuration
app.use(bodyParser.json({limit: '5mb'}))
app.use(cors())

// Setup catch-all API catch-all route
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to Contact-Reminder App'
}))

export default app
