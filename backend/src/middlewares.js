const { notAuthenticated, serverError } = require('./errors');
const { verifyToken } = require('./utils/utils');

exports.authentication = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const statusCode = notAuthenticated.statusCode;
  const message = notAuthenticated.message;

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

exports.errorHandler = async (err, req, res, next) => {
  if (!err.statusCode) {
    return res.status(serverError.statusCode).json({ error: serverError.message });
  }
  return res.status(err.statusCode).json({ error: err.message });
};
