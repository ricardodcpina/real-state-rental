const express = require('express');
const router = express.Router();

const dashboardService = require('../services/dashboard_service');
const { authentication } = require('../middlewares');

router.get('/houses', authentication, async (req, res) => {
  const { limit, skip } = req.query;
  const { userId } = req;

  try {
    const houses = await dashboardService.listMyHouses(userId, limit, skip);

    res.status(200).json(houses);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).json({ error: err.message });
  }
});

router.get('/reserves', authentication, async (req, res) => {
  const { limit, skip } = req.query;
  const { userId } = req;

  try {
    const reserves = await dashboardService.listMyReserves(userId, limit, skip);

    res.status(200).json(reserves);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).json({ error: err.message });
  }
});

router.delete('/houses', authentication, async (req, res) => {
  const { userId } = req;

  try {
    const houses = await dashboardService.deleteMyHouses(userId);
    res.status(200).json(houses);
  } catch (error) {
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).json({ error: err.message });
  }
});

router.delete('/reserves', authentication, async (req, res) => {
  const { userId } = req;

  try {
    const reserves = await dashboardService.deleteMyReserves(userId);
    res.status(200).json(reserves);
  } catch (error) {
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).json({ error: err.message });
  }
});

module.exports = router;
