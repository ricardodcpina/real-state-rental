const { isValidObjectId } = require('mongoose');

const { House, Reserve } = require('../models');
const errors = require('../errors');

const { validateFields, deletePreviousEstateImage } = require('../utils/utils');

exports.createHouse = async (userId, filename, description, location, price, available) => {
  // Validate required fields
  validateFields({ description, price, location, available });

  // Save house on database
  const house = await House.create({
    user: userId,
    thumbnail: filename,
    description,
    location,
    price,
    available,
  });

  return house;
};

exports.listHouses = async (
  available,
  limit = 0,
  skip = 0,
  maxCost = Infinity,
  estateLocation = '',
  estateName = ''
) => {
  // List houses using designated filters
  const houses = await House.find(
    {
      available,
      price: { $lte: maxCost },
      location: { $regex: estateLocation, $options: 'i' },
      description: { $regex: estateName, $options: 'i' },
    },
    null,
    { limit, skip }
  );
  return houses;
};

exports.findHouse = async (houseId) => {
  // Checks Object ID validity
  if (!isValidObjectId(houseId)) throw errors.invalidID;

  // Checks for house ID
  const house = await House.findOne({ _id: houseId });
  if (!house) throw errors.invalidID;

  await House.populate(house, 'reserve');

  return house;
};

exports.updateHouse = async (userId, houseId, input, filename) => {
  // Checks Object ID validity
  if (!isValidObjectId(houseId)) throw errors.invalidID;

  // Checks for house ID
  const house = await House.findOne({ _id: houseId });
  if (!house) throw errors.invalidID;

  // Forbid changing userID field
  if (input.user || String(input.user) === '') {
    throw errors.notAllowed;
  }

  // Checks if user is the owner
  if (String(house.user) !== userId) {
    throw errors.notAllowed;
  }

  // Validate provided fields
  validateFields(input);

  // Deletes image file from public folder if new one is provided
  if (filename) {
    deletePreviousEstateImage(house.thumbnail);
  }

  // Update house on database
  const updatedHouse = await House.findByIdAndUpdate(
    { _id: houseId },
    { thumbnail: filename || house.thumbnail, ...input },
    { new: true }
  );

  return updatedHouse;
};

exports.deleteHouse = async (userId, houseId) => {
  // Checks Object ID validity
  if (!isValidObjectId(houseId)) throw errors.invalidID;

  // Checks for house ID
  const house = await House.findOne({ _id: houseId });
  if (!house) throw errors.invalidID;

  // Checks if user is the owner
  if (String(house.user) !== userId) {
    throw errors.notAllowed;
  }

  // Deletes image file from public folder
  deletePreviousEstateImage(house.thumbnail);

  // Deletes associated reserve from database if any
  await Reserve.deleteOne({ house: houseId });

  // Deletes house from database
  const deleted = await House.deleteOne({ _id: houseId });

  return deleted;
};
