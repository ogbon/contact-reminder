const validators = {
  requestSchema: (schema, dataKey) => (req, res, next) => {
    const {error} = schema.validate(req[dataKey])
    const valid = error == null
    if (valid) {
      next()
    } else {
      const {details} = error
      const message = details.map(i => i.message).join(',')
      res.status(422).json({error: message})
    }
  }
}

export default validators
