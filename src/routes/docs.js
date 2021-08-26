/* eslint-disable babel/new-cap */
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import express from 'express'
import YamlJS from 'yamljs'
import basicAuth from 'express-basic-auth'


const docsRouter = express.Router()

const docsPath = path.resolve(__dirname, '../../docs/spec.yaml')
const swaggerDocument = YamlJS.load(docsPath)


const basicAuthMiddleware = basicAuth({
  users: {
    [process.env.DOCS_BASIC_AUTH_USERNAME]: process.env.DOCS_BASIC_AUTH_PASSWORD
  },
  challenge: true,
  unauthorizedResponse: 'Sorry. You do not have access to this page.'
})


docsRouter.use('/', basicAuthMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default docsRouter
