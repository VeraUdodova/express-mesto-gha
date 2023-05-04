const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const {
  createUser, login,
} = require('./controllers/users');
const {
  HTTP_400, HTTP_500, HTTP_409
} = require('./utils/utils');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb1');

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(new RegExp(/https?:\/\/(?:|www.?)[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?/)),
  }),
}), createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(errors());

app.use((err, req, res, next) => {
  let { statusCode = HTTP_500, message } = err;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = HTTP_400;
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = HTTP_400;
    message = 'запрос некорректен';
  } else if (err.code === 11000) {
    statusCode = HTTP_409;
    message = 'Такой пользователь уже есть'
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
});
