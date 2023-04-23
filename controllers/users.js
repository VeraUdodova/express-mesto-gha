const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const {setResponse, validateText, validateUrl, errorResponse} = require('../utils/utils')

module.exports.getUser = (req, res) => {
  const {userId} = req.params;

  if (!ObjectId.isValid(userId)) {
    setResponse({
      res, message: 'id некорректен', httpStatus: 400
    });
    return;
  }

  User.findById(userId)
    .then(user => {
      setResponse(
        user === null ?
          {res, message: 'Пользователь не найден', httpStatus: 404} :
          {res, messageKey: 'data', message: user}
      )
    })
    .catch(() => setResponse({res, httpStatus: 500}))
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => {
      setResponse({res, messageKey: 'data', message: users})
    })
    .catch(() => setResponse({res, httpStatus: 500}))
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  let profile = {};
  let errors = [];

  const nameValidation = validateText(name);
  const aboutValidation = validateText(about);
  const avatarValidation = validateUrl(avatar)

  if (nameValidation === true) {
    profile['name'] = name;
  } else {
    errors.push(nameValidation)
  }

  if (aboutValidation === true) {
    profile['about'] = about;
  } else {
    errors.push(aboutValidation)
  }

  if (avatarValidation === true) {
    profile['avatar'] = avatar;
  } else {
    errors.push(avatarValidation)
  }

  if (errorResponse(res, profile, errors)) {
    User.create(
      {name, about, avatar},
      {new: true, runValidators: true}
    )
      .then(user => setResponse({res, messageKey: 'data', message: user}))
      .catch(() => setResponse({res, httpStatus: 500}));
  }
};

const profileUpdateResponse = (res, req, profile, errors) => {
  if (errorResponse(res, profile, errors)) {
    User.findByIdAndUpdate(
      req.user._id,
      profile,
      {new: true, runValidators: true}
    )
      .then((user) => setResponse({
        res,
        messageKey: 'user',
        message: user
      }))
      .catch(() => setResponse({res, httpStatus: 500}))
  }
}

module.exports.updateUser = (req, res) => {
  const {name, about} = req.body;
  let profile = {};
  let errors = [];

  const nameValidation = validateText(name);
  const aboutValidation = validateText(about);

  if (nameValidation === true) {
    profile['name'] = name;
  } else {
    errors.push(nameValidation)
  }

  if (aboutValidation === true) {
    profile['about'] = about;
  } else {
    errors.push(aboutValidation)
  }

  profileUpdateResponse(res, req, profile, errors)
}

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  let profile = {};
  let errors = [];

  const avatarValidation = validateUrl(avatar)

  if (avatarValidation === true) {
    profile['avatar'] = avatar;
  } else {
    errors.push(avatarValidation)
  }

  profileUpdateResponse(res, req, profile, errors)
}
