const express = require('express');
const router = express.Router();

const reserveService = require('../services/reserve_service');
const { authentication } = require('../middlewares');

router.post('/:id/reserves', authentication, async (req, res, next) => {
  const { userId } = req;
  const { date } = req.body;
  const houseId = req.params.id;

  try {
    const reserve = await reserveService.createReserve(userId, houseId, date);

    res.status(201).json(reserve);
  } catch (err) {
    next(err)
  }
});

router.delete('/reserves/:id', authentication, async (req, res, next) => {
  const { userId } = req;
  const reserveId = req.params.id;

  try {
    const reserve = await reserveService.cancelReserve(userId, reserveId);

    res.status(200).json(reserve);
  } catch (err) {
    next(err)
  }
});

module.exports = router;
