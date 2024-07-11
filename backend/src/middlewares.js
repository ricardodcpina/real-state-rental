require('dotenv').config();

const { notAuthenticated, tokenExpired } = require('./errors');
const { verifyToken } = require('./utils/utils');

exports.authentication = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let statusCode = notAuthenticated.statusCode;
  let message = notAuthenticated.message;

  if (!authHeader) {
    return res.status(statusCode).json({ error: message });
  }

  const [_, token] = authHeader.split(' ');

  if (!token) {
    return res.status(statusCode).json({ error: message });
  }

  try {
    const payload = await verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch (error) {
    return res.status(statusCode).json({ error: message });
  }
};
