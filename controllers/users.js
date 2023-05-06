const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotAuthorizedError = require('../errors/not-authorized');
const { SECRET } = require('../config');

const {
  setResponse,
  HTTP_201,
} = require('../utils/utils');

const getUser = (req, res, next) => {
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

const getMe = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }

      setResponse({ res, messageKey: 'data', message: user });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => setResponse({ res, messageKey: 'data', message: users }))
    .catch(next);
};

const registration = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => setResponse({
        res,
        messageKey: null,
        message: {
          _id: user.id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
        httpStatus: HTTP_201,
      }))
      .catch(next));
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

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  profileUpdateResponse(res, req, next, { name, about });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  profileUpdateResponse(res, req, next, { avatar });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user === null) {
        throw new NotAuthorizedError('Неправильные почта или пароль');
      }
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send();
    })
    .catch(next);
};

module.exports = {
  SECRET,
  getMe,
  registration,
  updateUser,
  login,
  getUsers,
  getUser,
  updateAvatar,
};
