const dotenv = require('dotenv')
const { ethers } = require("ethers")
const crypto = require("crypto")

dotenv.config()


const contract_address = process.env['CONTRACT_ADDRESS']
const ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_recipe","type":"string"},{"internalType":"string","name":"_patient","type":"string"},{"internalType":"string","name":"_doctor","type":"string"},{"internalType":"string","name":"_data","type":"string"},{"internalType":"string","name":"_date","type":"string"}],"name":"addMedRecipe","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getMedRecipes","outputs":[{"components":[{"internalType":"string","name":"recipe","type":"string"},{"internalType":"string","name":"patient","type":"string"},{"internalType":"string","name":"doctor","type":"string"},{"internalType":"string","name":"data","type":"string"},{"internalType":"string","name":"date","type":"string"}],"internalType":"struct MedRecipes.MedRecipe[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"patient","type":"string"}],"name":"getMedRecipesByPatient","outputs":[{"components":[{"internalType":"string","name":"recipe","type":"string"},{"internalType":"string","name":"patient","type":"string"},{"internalType":"string","name":"doctor","type":"string"},{"internalType":"string","name":"data","type":"string"},{"internalType":"string","name":"date","type":"string"}],"internalType":"struct MedRecipes.MedRecipe[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"medRecipes","outputs":[{"internalType":"string","name":"recipe","type":"string"},{"internalType":"string","name":"patient","type":"string"},{"internalType":"string","name":"doctor","type":"string"},{"internalType":"string","name":"data","type":"string"},{"internalType":"string","name":"date","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

const infura_id = process.env['INFURA_ID']
const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${infura_id}`)

const contract = new ethers.Contract(contract_address, ABI, provider)

const privateKey = process.env['PRIVATE_KEY']

const wallet = new ethers.Wallet(privateKey, provider)

const getMeds = async () => {
    const meds = await contract.getMedRecipes()

    console.log(meds)

    const listData = []

    for (const m of meds) {
        const medData = {}

        medData['recipeId'] = m[0]
        medData['userId'] = m[1]
        medData['citizenId'] = m[2]
        medData['medications'] = JSON.parse(m[3])
        medData['createdAt'] = m[4]

        console.log(medData['medications'])

        listData.push(medData)
    }

    return listData
}

const createMeds = async (data) => {
    data['recipeId'] = crypto.createHash('sha256').update(`${data['userId']}${data['citizenId']}${data['createdAt']}${process.env['SECRET_HASH']}`).digest('hex');
    data['userId'] = crypto.createHash('sha256').update(`${data['userId']}${process.env['SECRET_HASH']}`).digest('hex');
    data['citizenId'] = crypto.createHash('sha256').update(`${data['citizenId']}${process.env['SECRET_HASH']}`).digest('hex');

    const contractWithWallet = contract.connect(wallet)
    const tx = await contractWithWallet.addMedRecipe(data['recipeId'], data['citizenId'], data['userId'], JSON.stringify(data['medications']), data['createdAt'])
    await tx.wait()

    console.log(tx)
    console.log(typeof tx)
}

const getMedsByPatient = async (patient) => { 
    patient = crypto.createHash('sha256').update(`${patient}${process.env['SECRET_HASH']}`).digest('hex');

    const meds = await contract.getMedRecipesByPatient(patient)

    console.log(meds)

    const listData = []

    for (const m of meds) {
        const medData = {}

        medData['recipeId'] = m[0]
        medData['userId'] = m[1]
        medData['citizenId'] = m[2]
        medData['medications'] = JSON.parse(m[3])
        medData['createdAt'] = m[4]

        console.log(medData['medications'])

        listData.push(medData)
    }

    return listData
}

module.exports = {
    getMeds: getMeds,
    createMeds: createMeds,
    getMedsByPatient: getMedsByPatient
}
