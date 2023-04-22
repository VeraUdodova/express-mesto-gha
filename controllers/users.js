const User = require('../models/user');

module.exports.getUser = (req, res) => {
  const {id} = req.params;

  (typeof id !== 'undefined' ? User.findById(id) : User.find({}))
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({message: 'На сервере произошла ошибка'}))
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: 'На сервере произошла ошибка'}));
};