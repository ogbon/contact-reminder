const Joi = require('joi')

const schemas = {
  auth: {
    signIn: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
    signUp: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required()
    })
  }
}

export default schemas
