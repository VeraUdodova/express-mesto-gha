const User = require('../models/user');
const {setResponse} = require('../utils/utils')

module.exports.getUser = (req, res) => {
  const {userId} = req.params;

  (typeof userId !== 'undefined' ? User.findById(userId) : User.find({}))
    .then(users => setResponse({res, messageKey: 'data', message: users}))
    .catch(() => setResponse({res, httpStatus: 500}))
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(() => res.status(500).send({message: 'На сервере произошла ошибка'}));
};

const profileUpdateResponse = (res, req, profile, errors) => {
  if (Object.keys(profile).length === 0) {
    errors.push('Ничего не передано')
  }

  if (errors.length > 0) {
    return setResponse({
      res: res,
      message: errors,
      httpStatus: 400
    })
  }

  User.findByIdAndUpdate(req.user._id, profile)
    .then((user) => setResponse({
      res,
      messageKey: 'user',
      message: user
    }))
    .catch(() => setResponse({res, httpStatus: 500}))
}

module.exports.updateUser = (req, res) => {
  const {name, about} = req.body;
  let profile = {};
  let errors = [];

  if (typeof name !== 'undefined') {
    if (name.length >= 2 && name.length <= 30) {
      profile['name'] = name;
    } else {
      errors.push('name: не удовлетворят параметрам')
    }
  }
  if (typeof about !== 'undefined') {
    if (about.length >= 2 && about.length <= 30) {
      profile['about'] = about;
    } else {
      errors.push('about: не удовлетворят параметрам')
    }
  }

  profileUpdateResponse(res, req, profile, errors)
}

module.exports.updateAvatar = (req, res) => {
  const {avatar} = req.body;
  let profile = {};
  let errors = [];

  if (typeof avatar != 'undefined') {
    if (avatar.length > 0) {
      profile.avatar = avatar;
    } else {
      errors.push('avatar: не удовлетворят параметрам')
    }
  }

  profileUpdateResponse(res, req, profile, errors)
}
