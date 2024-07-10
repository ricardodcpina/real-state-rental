const { isValidObjectId } = require('mongoose');

const { House, Reserve } = require('../models');
const { validateFields } = require('./user_service');
const errors = require('../errors');

exports.createReserve = async (userId, houseId, date) => {
  // Check Object ID validity
  if (!isValidObjectId(houseId)) throw errors.invalidID;

  // Validate date field
  validateFields({ date });

  // Checks for associated estate ID
  const house = await House.findOne({ _id: houseId });
  if (!house) throw errors.notFound;

  // Checks if user is not the owner
  if (String(house.user) === userId) {
    throw errors.notAllowed;
  }

  // Creates reserve
  const reserve = await Reserve.create({ user: userId, house: houseId, date });

  await Reserve.populate(reserve, 'user');
  await Reserve.populate(reserve, 'house');

  // Sets estate availability to false and attaches reservation
  await House.updateOne({ _id: houseId }, { available: false, reserve: reserve._id });

  return reserve;
};

exports.cancelReserve = async (userId, reserveId) => {
  // Checks Object ID validity
  if (!isValidObjectId(reserveId)) throw errors.invalidID;

  // Checks for reserve ID
  const reserve = await Reserve.findOne({ _id: reserveId });
  if (!reserve) throw errors.notFound;

  // Checks if reserve belongs to user
  if (String(reserve.user) !== userId) throw errors.notAllowed;

  // Sets house availability to true
  await House.updateOne({ _id: reserve.house }, { available: true });

  // Deletes the reserve
  return await Reserve.deleteOne({ _id: reserveId });
};
