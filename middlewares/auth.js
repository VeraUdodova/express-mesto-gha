const jwt = require('jsonwebtoken');
const { HTTP_401 } = require('../utils/utils');
const { SECRET } = require('../controllers/users');

const handleAuthError = (res) => {
  res
    .status(HTTP_401)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();

  return false;
};
