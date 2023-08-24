const express = require('express')
const router = express.Router()

const dashboardService = require('../services/dashboard_service')
const { authentication } = require('../middlewares')

router.get('/', authentication, async (req, res) => {
    const { userId } = req

    try {
        const houses = await dashboardService.listMyHouses(userId)

        res.status(200).json(houses)
    }
    catch (err) {
        if (!err.statusCode) err.statusCode = 500
        res.status(err.statusCode).json({ error: err.message })
    }
})

module.exports = router