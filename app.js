const express = require('express')
var jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

const { getMeds, createMeds, getMedsByPatient } = require('./services/med_recipes_sm.js')
const { validateSchema } = require('./schemas/medSchema.js')

app.use(express.json())

const port = process.env['PORT']
const secret = process.env['SECRET']

const auth = function (req, res, next) {
    const token = req.headers['api-key']

    if(!token) return res.status(401).json({'message': 'Unauthorized access!'})

    if(token != process.env['API_KEY']) return res.status(401).json({'message': 'Unauthorized access!'})

    next()
}

app.post('/med-recipes/', auth, async (req, res) => {
    const val = validateSchema(req.body)

    if(!val[0]) res.status(400).json(val[1])

    const result = await createMeds(req.body)

    res.json(result);
})

app.get('/med-recipes/', auth, async (req, res) => {
    const meds = await getMeds()

    return res.status(200).json(meds)
})


app.get('/med-recipes/:patient', auth, async (req, res) => {
    const { patient } = req.params

    const response = await getMedsByPatient(patient)

    res.json(response);
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))