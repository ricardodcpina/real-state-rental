const express = require('express')
const multer = require('multer')
const router = express.Router()

const uploadConfig = require('../config/upload')
const upload = multer(uploadConfig).single('thumbnail')

const houseService = require('../services/house_service')
const { authentication } = require('../middlewares')

router.post('/', authentication, upload, async (req, res) => {
    const { filename } = req.file
    const { description, location, price, available } = req.body
    const { userId } = req

    try {
        const house = await houseService.createHouse(
            userId, filename, description, location, price, available
        )
        res.status(201).json(house)
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

router.get('/', async (req, res) => {
    const { available } = req.query

    try {
        const houses = await houseService.listHouses(available)
        res.status(200).json(houses)
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const house = await houseService.findHouse(id)
        res.status(200).json(house)
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

router.put('/:id', authentication, upload, async (req, res) => {
    const { filename } = req.file
    const { userId } = req
    const houseId = req.params.id
    const input = req.body

    try {
        const house = await houseService.updateHouse(
            userId, houseId, input, filename)
        res.status(200).json(house)
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

router.delete('/:id', authentication, async (req, res) => {
    const { userId } = req
    const houseId = req.params.id

    try {
        const house = await houseService.deleteHouse(userId, houseId)
        res.status(200).json(house)
    } catch (err) {
        res.status(err.statusCode).json({ error: err.message })
    }
})

module.exports = router