const fs = require('fs');
const path = require('path');
const { isValidObjectId } = require('mongoose');
const { validateFields } = require('./user_service');

const { House } = require('../models');

const errors = require('../errors');

////////////////////////  AUXILIARY FUNCTIONS  /////////////////////////

// NEEDS TO BE INCLUDED IN TESTS!
const deletePreviousEstateImage = (estateImage) => {
  const imagePath = path.resolve(__dirname, '..', '..', '..', 'public', 'images', estateImage);

  fs.unlink(imagePath, (err) => {
    if (err) console.log(err);
    else {
      console.log('Last image file deleted with success');
    }
  });
};

const validateFile = (file) => {
  if (!file) {
    throw errors.fileRequired;
  }
};

////////////////////////  MAIN FUNCTIONS  //////////////////////////////

exports.createHouse = async (userId, filename, description, location, price, available) => {
  // Validate required fields
  validateFields({ description, price, location, available });

  // Validate file input
  validateFile(filename);

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

exports.listHouses = async (available, limit, skip, maxCost, estateLocation, estateName) => {
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

// MUST BE INCLUDED IN TESTS
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

  // Hard delete house from database
  const deleted = await House.deleteOne({ _id: houseId });

  return deleted;
};
