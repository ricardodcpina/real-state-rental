const { House, Reserve } = require('../models');

exports.listMyHouses = async (userId, limit = 0, skip = 0) => {
  const houses = await House.find({ user: userId }, null, { limit, skip });

  return houses;
};

exports.listMyReserves = async (userId, limit = 0, skip = 0) => {
  const reserves = await Reserve.find({ user: userId }, null, { limit, skip });

  await Reserve.populate(reserves, 'house');

  return reserves;
};

exports.deleteMyHouses = async (userId) => {
  const deletedHouses = await House.deleteMany({ user: userId });

  return deletedHouses;
};
