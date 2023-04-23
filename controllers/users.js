const User = require('../models/user');
const {setResponse} = require('../utils/utils')

module.exports.getUser = (req, res) => {
  const {userId} = req.params;

  (typeof userId !== 'undefined' ? User.findById(userId) : User.find({}))
    .then(users => setResponse({res, messageKey: 'data', message: users}))
    .catch(() => setResponse({res, httpStatus: 500}))
}

const validateProfileName = (name) => {
  if (typeof name !== 'undefined' && name.length >= 2 && name.length <= 30) {
      return true;
  }

  return {'error': 'name: не удовлетворят параметрам'}
}
const validateProfileAbout = (about) => {
  if (typeof about !== 'undefined' && about.length >= 2 && about.length <= 30) {
    return true;
  }

  return {'error': 'about: не удовлетворят параметрам'}
}
const validateProfileAvatar = (avatar) => {
  if (typeof avatar !== 'undefined' && avatar.length > 0) {
    return true;
  }

  return {'error': 'avatar: не удовлетворят параметрам'}
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  let profile = {};
  let errors = [];

  const nameValidation = validateProfileName(name);
  const aboutValidation = validateProfileAbout(about);
  const avatarValidation = validateProfileAvatar(avatar)

  if (nameValidation === true) {
    profile['name'] = name;
  } else {
    errors.push(nameValidation['error'])
  }

  if (aboutValidation === true) {
    profile['about'] = about;
  } else {
    errors.push(aboutValidation['error'])
  }

  if (avatarValidation === true) {
    profile['avatar'] = avatar;
  } else {
    errors.push(avatarValidation['error'])
  }

  if (profileErrors(res, profile, errors)) {
    User.create({name, about, avatar})
      .then(user => res.send({data: user}))
      .catch(() => setResponse({res, httpStatus: 500}));
  }
};

const profileErrors = (res, profile, errors) => {
  if (Object.keys(profile).length === 0) {
    errors.push('Ничего не передано')
  }

  if (errors.length > 0) {
    setResponse({
      res: res,
      message: errors,
      httpStatus: 400
    })

    return false
  }

  return true
}

const profileUpdateResponse = (res, req, profile, errors) => {
  if (profileErrors(res, profile, errors)) {
    User.findByIdAndUpdate(req.user._id, profile)
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

  const nameValidation = validateProfileName(name);
  const aboutValidation = validateProfileAbout(about);

  if (nameValidation === true) {
    profile['name'] = name;
  } else {
    errors.push(nameValidation['error'])
  }

  if (aboutValidation === true) {
    profile['about'] = about;
  } else {
    errors.push(aboutValidation['error'])
  }

  profileUpdateResponse(res, req, profile, errors)
}

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  let profile = {};
  let errors = [];

  const avatarValidation = validateProfileAvatar(avatar)

  if (avatarValidation === true) {
    profile['avatar'] = avatar;
  } else {
    errors.push(avatarValidation['error'])
  }

  profileUpdateResponse(res, req, profile, errors)
}
