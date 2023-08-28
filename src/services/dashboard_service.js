const { House } = require('../models')

exports.listMyHouses = async (userId) => {
    const houses = await House.find({ user: userId })

    return houses
}