const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { registration, login } = require('./controllers/users');
const { errorHandler } = require('./utils/utils');
const NotFoundError = require('./errors/not-found-err');
const auth = require('./middlewares/auth');
const { signupValidator, signinValidator } = require('./validators/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb1');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/signin', signinValidator, login);
app.use('/signup', signupValidator, registration);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/', () => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
});
