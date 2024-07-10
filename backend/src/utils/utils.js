require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const errors = require('../errors');

exports.validateFields = (input) => {
  // Check for undefined and blank fields
  for (let field in input) {
    let fieldValue = String(input[field]);
    if (!fieldValue || fieldValue.trim() === '') {
      let formattedField = field.replace(field[0], field[0].toUpperCase());
      throw {
        message: `${formattedField} is required`,
        statusCode: 400,
      };
    }
  }
  return true;
};

exports.verifyEmail = async (email) => {
  // Check email is unique
  const user = await User.findOne({
    email,
    deletedAt: { $exists: false },
  });

  if (user) throw errors.emailNotUnique;

  // Check email for correct formatting
  let regex = RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

  if (!regex.test(email)) throw errors.emailnotFormatted;

  return true;
};

exports.hashPassword = (password) => {
  return bcrypt.hash(password, process.env.SALT);
};

exports.generateToken = (userId) => {
  return jwt.sign({ sub: userId }, process.env.HASH_SECRET, {
    expiresIn: '180s',
  });
};