const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const {
  setResponse,
  errorResponse,
  HTTP_404, HTTP_201,
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

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => setResponse({ res, messageKey: 'data', message: users }))
    .catch((errors) => errorResponse(res, errors));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => setResponse({
      res, messageKey: null, message: user, httpStatus: HTTP_201,
    }))
    .catch((errors) => errorResponse(res, errors));
};

const profileUpdateResponse = (res, req, profile) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    profile,
    { new: true, runValidators: true },
  )
    .then((user) => setResponse(
      user === null
        ? { res, message: 'Пользователь не найден', httpStatus: HTTP_404 }
        : { res, messageKey: 'user', message: user },
    ))
    .catch((errors) => errorResponse(res, errors));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  profileUpdateResponse(res, req, { name, about });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  profileUpdateResponse(res, req, { avatar });
};
