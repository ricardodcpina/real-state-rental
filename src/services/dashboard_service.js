const models = require('../models')

exports.listMyHouses = async (userId) => {
    const houses = await models.House.find({ user: userId })

    return houses
}