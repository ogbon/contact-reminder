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
  },
  contact: {
    create: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      meetingPlace: Joi.string().required(),
      meetingDate: Joi.date(),
      purpose: Joi.string().required()
    }),

    update: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      meetingPlace: Joi.string(),
      meetingDate: Joi.date(),
      purpose: Joi.string()
    })
  }
}

export default schemas
