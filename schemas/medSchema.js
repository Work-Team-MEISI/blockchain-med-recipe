const Ajv = require("ajv")
const { default: validation } = require("ajv/dist/vocabularies/validation")
const ajv = new Ajv()

const defaultOptions = {
    strictRequired: true
}

const recipeInfo = {
    type: "object",
    "properties": {
        "medicationId": {type: "string"},
        "signature": {type: "string"},
        "alias": {type: "string"}
    },
    required: ['medicationId', 'signature', 'alias'],
    additionalProperties: false
}

const recipesArrayInfo = {
    type: "array",
    items: recipeInfo
}

const schema = {
    type: "object",
    properties: {
        userId: {type: "string"},
        citizenId: {type: "string"}, 
        medications: recipesArrayInfo,
        createdAt: {type: 'string'}
    },
    required: ['userId', 'citizenId', 'medications', 'createdAt'],
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