const express = require('express')
const router = express.Router()

const dashboardService = require('../services/dashboard_service')
const { authentication } = require('../middlewares')

router.get('/', authentication, async (req, res) => {
    const { userId } = req

    const houses = await dashboardService.listMyHouses(userId)

    res.status(200).json(houses)
})

module.exports = router