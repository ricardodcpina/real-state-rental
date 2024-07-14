const express = require('express');
const router = express.Router();

const dashboardService = require('../services/dashboard_service');
const { authentication } = require('../middlewares');

router.get('/houses', authentication, async (req, res, next) => {
  const { limit, skip } = req.query;
  const { userId } = req;

  try {
    const houses = await dashboardService.listMyHouses(userId, limit, skip);

    res.status(200).json(houses);
  } catch (err) {
    next(err);
  }
});

router.get('/reserves', authentication, async (req, res, next) => {
  const { limit, skip } = req.query;
  const { userId } = req;

  try {
    const reserves = await dashboardService.listMyReserves(userId, limit, skip);

    res.status(200).json(reserves);
  } catch (err) {
    next(err);
  }
});

router.delete('/houses', authentication, async (req, res, next) => {
  const { userId } = req;

  try {
    const houses = await dashboardService.deleteMyHouses(userId);
    res.status(200).json(houses);
  } catch (error) {
    next(err);
  }
});

router.delete('/reserves', authentication, async (req, res, next) => {
  const { userId } = req;

  try {
    const reserves = await dashboardService.deleteMyReserves(userId);
    res.status(200).json(reserves);
  } catch (error) {
    next(err);
  }
});

module.exports = router;
