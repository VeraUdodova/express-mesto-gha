const express = require('express');
const mongoose = require('mongoose');
const {
  createUser, login,
} = require('./controllers/users');
const {
  setResponse, HTTP_404, HTTP_400, HTTP_500,
} = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '644392bfbf64737d49e63f34', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/signup', login);
app.use('/signin', createUser);

app.use((req, res) => {
  setResponse({ res, message: 'Страница не найдена', httpStatus: HTTP_404 });
});

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
