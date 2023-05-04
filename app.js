const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const {
  createUser, login,
} = require('./controllers/users');
const {
  HTTP_400, HTTP_500,
} = require('./utils/utils');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/signin', login);
app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
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
