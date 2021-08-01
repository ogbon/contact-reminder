import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs'

const app = express()

// Express application configuration
app.use(bodyParser.json({limit: '5mb'}))
app.use(cors())

// auto load routes here
fs.readdirSync(`${__dirname}/routes/`)
  .filter(file => file.slice(-3) === '.js')
  .forEach(file => {
    const namespace = file.split('.')[0]
    const routes = require(`./routes/${file}`).default
    app.use(`/${namespace}`, routes)
  })

// Setup catch-all API catch-all route
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to Contact-Reminder App'
}))

export default app
