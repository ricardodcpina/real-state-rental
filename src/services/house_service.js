const errors = require('../errors')
const models = require('../models')

exports.createHouse = async (userId, description, price, available) => {

    // validate fields

    // save house on db
    const house = await models.House.create({
        user: userId, description, price, available
    })

    return house
}

exports.listHouses = async (available) => {
    const houses = await models.House.find({ available })

    return houses
}

exports.updateHouse = async (userId, houseId, input) => {


    const house = await models.House.findOne({ _id: houseId })

    if (!house) {
        throw errors.invalidID // 400
    }

    if ((String(house.user)) !== userId) {
        throw errors.unauthorized // 401
    }

    const updatedHouse = await models.House.findByIdAndUpdate(
        { _id: houseId }, { ...input }, { new: true })

    return updatedHouse
}

exports.deleteHouse = async (userId, houseId) => {

    const house = await models.House.findOne({ _id: houseId })

    if (!house) {
        throw errors.invalidID // 400
    }

    if ((String(house.user)) !== userId) {
        throw errors.unauthorized // 401
    }

    const deletedHouse = await models.House.deleteOne({ _id: houseId })

    return deletedHouse
}