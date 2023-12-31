const { isValidObjectId } = require('mongoose')
const { validateFields } = require('./user_service')

const { House } = require('../models')
const errors = require('../errors')

exports.createHouse = async (userId, filename, description, location, price, available) => {

    // Validate required fields
    validateFields({ description, price, location, available })

    // Save house on database
    const house = await House.create({
        user: userId, thumbnail: filename, description, location, price, available
    })

    return house
}

exports.listHouses = async (available) => {
    // List houses by availability
    const houses = await House.find({ available })

    return houses
}

// MUST BE INCLUDED IN TEST
exports.findHouse = async (houseId) => {
    // Checks Object ID validity
    if (!isValidObjectId(houseId)) throw errors.invalidID

    // Checks for house ID
    const house = await House.findOne({ _id: houseId })
    if (!house) throw errors.invalidID

    return house
}

exports.updateHouse = async (userId, houseId, input, filename) => {

    // Checks Object ID validity
    if (!isValidObjectId(houseId)) throw errors.invalidID

    // Checks for house ID
    const house = await House.findOne({ _id: houseId })
    if (!house) throw errors.invalidID

    // Forbid changing userID field
    if (input.user || String(input.user) === "") {
        throw errors.notAllowed
    }

    // Checks if user is the owner
    if ((String(house.user)) !== userId) {
        throw errors.notAllowed
    }

    // Validate provided fields
    validateFields(input)

    // Update house on database
    const updatedHouse = await House.findByIdAndUpdate(
        { _id: houseId }, { thumbnail: filename, ...input }, { new: true })

    return updatedHouse
}

exports.deleteHouse = async (userId, houseId) => {

    // Checks Object ID validity
    if (!isValidObjectId(houseId)) throw errors.invalidID

    // Checks for house ID
    const house = await House.findOne({ _id: houseId })
    if (!house) throw errors.invalidID

    // Checks if user is the owner
    if ((String(house.user)) !== userId) {
        throw errors.notAllowed
    }

    // Hard delete house from database
    const deleted = await House.deleteOne({ _id: houseId })

    return deleted
}