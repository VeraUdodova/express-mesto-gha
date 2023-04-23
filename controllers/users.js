const User = require('../models/user');
const {
  setResponse,
  // validateText,
  // validateUrl,
  // errorResponse,
  validateId, HTTP_404, HTTP_500, HTTP_201,
} = require('../utils/utils');

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  if (validateId(res, userId)) {
    User.findById(userId)
      .then((user) => {
        setResponse(
          user === null
            ? { res, message: 'Пользователь не найден', httpStatus: HTTP_404 }
            : { res, messageKey: 'data', message: user },
        );
      })
      .catch(() => setResponse({ res, httpStatus: HTTP_500 }));
  }
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => setResponse({ res, messageKey: 'data', message: users }))
    .catch(() => setResponse({ res, httpStatus: HTTP_500 }));
};

module.exports.createUser = (req, res) => {
  // const { name, about, avatar } = req.body;
  // const profile = {};
  // const errors = [];
  //
  // const nameValidation = validateText(name);
  // const aboutValidation = validateText(about);
  // const avatarValidation = validateUrl(avatar);
  //
  // if (nameValidation === true) {
  //   profile.name = name;
  // } else {
  //   errors.push(nameValidation);
  // }
  //
  // if (aboutValidation === true) {
  //   profile.about = about;
  // } else {
  //   errors.push(aboutValidation);
  // }
  //
  // if (avatarValidation === true) {
  //   profile.avatar = avatar;
  // } else {
  //   errors.push(avatarValidation);
  // }

  // if (errorResponse(res, profile, errors)) {
    User.create({ name, about, avatar })
      .then((user) => setResponse({
        res, messageKey: null, message: user, httpStatus: HTTP_201,
      }))
      .catch(() => setResponse({ res, httpStatus: HTTP_500 }));
  // }
};

const profileUpdateResponse = (res, req, profile) => {
  const userId = req.user._id;

  if (validateId(res, userId) /* && errorResponse(res, profile, errors) */) {
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
      .catch(() => setResponse({ res, httpStatus: HTTP_500 }));
  }
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  // let profile = {};
  // let errors = [];
  //
  // const nameValidation = validateText(name);
  // const aboutValidation = validateText(about);
  //
  // if (nameValidation === true) {
  //   profile['name'] = name;
  // } else {
  //   errors.push(nameValidation)
  // }
  //
  // if (aboutValidation === true) {
  //   profile['about'] = about;
  // } else {
  //   errors.push(aboutValidation)
  // }

  profileUpdateResponse(res, req, { name, about });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // let profile = {};
  // let errors = [];
  //
  // const avatarValidation = validateUrl(avatar)
  //
  // if (avatarValidation === true) {
  //   profile['avatar'] = avatar;
  // } else {
  //   errors.push(avatarValidation)
  // }

  profileUpdateResponse(res, req, { avatar });
};
