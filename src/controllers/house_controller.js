const express = require('express')
const router = express.Router()

const houseService = require('../services/house_service')
const { authentication } = require('../middlewares')

router.post('/', authentication, async (req, res) => {
    const { description, price, available } = req.body
    const { userId } = req

    try {
        const house = await houseService.createHouse(
            userId, description, price, available
        )
        res.status(201).json(house)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.get('/', authentication, async (req, res) => {
    const { available } = req.query

    try {
        const houses = await houseService.listHouses(available)
        res.status(200).json(houses)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/:id', authentication, async (req, res) => {
    const houseId = req.params.id
    const input = req.body
    const { userId } = req

    try {
        const house = await houseService.updateHouse(userId, houseId, input)

        res.status(200).json(house)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/:id', authentication, async (req, res) => {
    const { userId } = req
    const houseId = req.params.id

    try {
        const house = await houseService.deleteHouse(userId, houseId)

        res.status(200).json(house)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router