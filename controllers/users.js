const User = require('../models/user');
const validator = require('validator').default;
const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err')
const {
  setResponse,
  HTTP_201,
} = require('../utils/utils');

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }

      setResponse({ res, messageKey: 'data', message: user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => setResponse({ res, messageKey: 'data', message: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (email && validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({ name, about, avatar, email, password:hash })
        .then((user) => setResponse({
          res, messageKey: null, message: user, httpStatus: HTTP_201,
        }))
        .catch(next));
  } else {
    throw new ValidationError('Неверный email')
  }
};

const profileUpdateResponse = (res, req, next, profile) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    profile,
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }

      setResponse({ res, messageKey: 'user', message: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  profileUpdateResponse(res, req, next, { name, about });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  profileUpdateResponse(res, req, next, { avatar });
};
