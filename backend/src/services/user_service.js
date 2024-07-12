const { isValidObjectId } = require('mongoose');
const { validateFields, hashPassword, verifyEmail, generateToken } = require('../utils/utils');

const { User } = require('../models');

const { listMyReserves, listMyHouses } = require('./dashboard_service');
const { cancelReserve } = require('./reserve_service');
const { deleteHouse } = require('./house_service');

const errors = require('../errors');

exports.createUser = async (username, email, password) => {
  // Validate required fields
  validateFields({ username, email, password });

  // Checks email formatting and availability
  await verifyEmail(email);

  // Apply encryption to password
  const cryptedPassword = await hashPassword(password);

  // Save user on database
  const input = { username, email, password: cryptedPassword };

  const user = await User.create(input);

  return user;
};

exports.authUser = async (username, password) => {
  // Validate input fields
  validateFields({ username, password });

  // Checks if username already exists
  const user = await User.findOne({
    username,
    deletedAt: { $exists: false },
  });
  if (!user) throw errors.notAuthenticated;

  // Apply encryption and check authenticity
  if ((await hashPassword(password)) !== user.password) throw errors.notAuthenticated;

  // Authenticate
  const token = await generateToken(user._id);

  return { authenticated: true, token, userId: user._id };
};

exports.updateUser = async (id, input) => {
  // Checks Object ID validity
  if (!isValidObjectId(id)) throw errors.invalidID;

  // Checks for user ID
  const user = await User.findOne({
    _id: id,
    deletedAt: { $exists: false },
  });
  if (!user) throw errors.invalidID;

  // Filter required fields for validation
  const { username, email, password } = input;
  const inputFilter = { username, email, password };

  // Validate provided fields
  validateFields(inputFilter);

  // If provided, check email uniqueness only when comparing to other users
  if (input.email && input.email !== user.email) {
    await verifyEmail(input.email);
  }

  // Apply encryption to new password if provided
  if (input.password) {
    input.password = await hashPassword(input.password);
  }

  // Update user data on database
  const updatedUser = await User.findByIdAndUpdate({ _id: id }, { ...input }, { new: true });

  return updatedUser;
};

exports.findUser = async (id) => {
  // Check ID validity
  if (!isValidObjectId(id)) throw errors.invalidID;

  // Checks for user ID
  const user = await User.findOne({
    _id: id,
    deletedAt: { $exists: false },
  });

  if (!user) throw errors.invalidID;

  return user;
};

exports.listUsers = async () => {
  return await User.find({ deletedAt: null });
};

exports.softDeleteUser = async (userId) => {
  // Check ID validity
  if (!isValidObjectId(userId)) throw errors.invalidID;

  // Checks for user ID
  const user = await User.findOne({
    _id: userId,
    deletedAt: { $exists: false },
  });
  if (!user) throw errors.invalidID;

  // Get and delete associated reserves
  const reserves = await listMyReserves(userId);
  reserves.forEach(async (reserve) => {
    await cancelReserve(userId, reserve._id);
  });

  // Get and delete associated estates
  const estates = await listMyHouses(userId);
  estates.forEach(async (estate) => {
    await deleteHouse(userId, estate._id);
  });

  // Add deletedAt field to user
  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    { deletedAt: Date.now() },

    { new: true }
  );

  return updatedUser;
};
