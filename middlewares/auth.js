const jwt = require('jsonwebtoken');
const { SECRET } = require('../controllers/users');
const NotAuthorizedError = require('../errors/not-authorized');

const handleAuthError = (next) => {
  next(new NotAuthorizedError());
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return handleAuthError(next);
  }

  req.user = payload;

  next();

  return false;
};
