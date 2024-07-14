const express = require('express');
const multer = require('multer');
const router = express.Router();

const uploadConfig = require('../config/upload');
const upload = multer(uploadConfig).single('thumbnail');

const houseService = require('../services/house_service');
const { authentication } = require('../middlewares');

router.post('/', authentication, upload, async (req, res, next) => {
  const { filename } = req.file || {};
  const { description, location, price, available } = req.body;
  const { userId } = req;

  try {
    const house = await houseService.createHouse(
      userId,
      filename,
      description,
      location,
      price,
      available
    );
    res.status(201).json(house);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  const { available, limit, skip, maxCost, estateLocation, estateName } = req.query;

  try {
    const houses = await houseService.listHouses(
      available,
      limit,
      skip,
      maxCost,
      estateLocation,
      estateName
    );
    res.status(200).json(houses);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const house = await houseService.findHouse(id);
    res.status(200).json(house);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authentication, upload, async (req, res, next) => {
  const { filename } = req.file || {};
  const { userId } = req;
  const houseId = req.params.id;
  const input = req.body;

  try {
    const house = await houseService.updateHouse(userId, houseId, input, filename);
    res.status(200).json(house);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authentication, async (req, res, next) => {
  const { userId } = req;
  const houseId = req.params.id;

  try {
    const house = await houseService.deleteHouse(userId, houseId);
    res.status(200).json(house);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
