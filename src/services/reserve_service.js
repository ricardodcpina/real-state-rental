const errors = require('../errors')
const models = require('../models')

exports.createReserve = async (userId, houseId, date) => {

    const house = await models.House.findOne({ _id: houseId })

    if (!house) {
        throw errors.invalidID
    }

    if (house.available === false) {
        throw errors.houseNotAvailable
    }

    if (String(house.user) === userId) {
        throw errors.reserveNotAllowed
    }

    const reserve = await models.Reserve.create(
        { user: userId, house: houseId, date })

    await reserve.populate('user')
    await reserve.populate('house')

    return reserve
}

exports.listReserves = async (userId) => {

    const reserves = await models.Reserve.find({ user: userId })
        .populate('house')

    return reserves
}

exports.cancelReserve = async (userId, reserveId) => {

    const reserve = await models.Reserve.findOne({ _id: reserveId })
        .populate('house')

    if (!reserve) throw errors.invalidID

    if (String(reserve.user) !== userId) throw errors.unauthorized

    await models.Reserve.deleteOne({ _id: reserveId })

    return reserve
}