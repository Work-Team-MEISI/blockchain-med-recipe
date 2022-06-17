const Ajv = require("ajv")
const { default: validation } = require("ajv/dist/vocabularies/validation")
const ajv = new Ajv()

const defaultOptions = {
    strictRequired: true
}

const recipeInfo = {
    type: "object",
    "properties": {
        "medId": {type: "integer"},
        "name": {type: "string"},
        "description": {type: "string"}
    },
    required: ['medId', 'name', 'description'],
    additionalProperties: false
}

const recipesArrayInfo = {
    type: "array",
    items: recipeInfo
}

const schema = {
    type: "object",
    properties: {
        doctorId: {type: "string"},
        patientId: {type: "string"}, 
        recipeInfo: recipesArrayInfo,
        registerDate: {type: 'string'}
    },
    required: ['doctorId', 'patientId', 'recipeInfo', 'registerDate'],
    additionalProperties: false
}

const validate = ajv.compile(schema)

const validateSchema = (data) => {
   const valid = validate(data)
   if (!valid) return [valid, validate.errors]
   return [valid, null]
}

module.exports = {
    validateSchema: validateSchema
}