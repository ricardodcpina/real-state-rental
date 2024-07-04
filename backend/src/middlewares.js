require('dotenv').config();

const jwt = require('jsonwebtoken');
const { notAuthenticated, tokenExpired } = require('./errors');

exports.authentication = (req, res, next) => {
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

  jwt.verify(token, process.env.HASH_SECRET, (err, payload) => {
    if (err) {
      if (err.message === 'jwt expired') {
        message = tokenExpired.message;
        statusCode = tokenExpired.statusCode;
      }

      return res.status(statusCode).json({ error: message });
    }
    req.userId = payload.sub;
    next();
  });
};
