const express = require('express')
const router = express.Router()

const reserveService = require('../services/reserve_service')
const { authentication } = require('../middlewares')

router.post('/:id/reserves', authentication, async (req, res) => {
    const { userId } = req
    const { date } = req.body
    const houseId = req.params.id

    try {
        const reserve = await reserveService.createReserve(userId, houseId, date)

        res.status(201).json(reserve)
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

router.get('/reserves', authentication, async (req, res) => {
    const { userId } = req

    try {
        const reserves = await reserveService.listMyReserves(userId)

        res.status(200).json(reserves)
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

router.delete('/reserves/:id', authentication, async (req, res) => {
    const { userId } = req
    const reserveId = req.params.id

    try {
        const reserve = await reserveService.cancelReserve(userId, reserveId)

        res.status(200).json(reserve)
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

module.exports = router