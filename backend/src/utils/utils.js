require('dotenv').config();

const bcrypt = require('bcrypt');
const { SignJWT, jwtVerify } = require('jose');

const { User } = require('../models');

const errors = require('../errors');

const key = new TextEncoder().encode(process.env.HASH_SECRET);

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

exports.generateToken = async (userId) => {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('60s')
    .sign(key);

  return token;
};

exports.verifyToken = async (token) => {
  const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });

  return payload;
};
