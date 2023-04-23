const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {setResponse, HTTP_404} = require('./utils/utils')

const {PORT = 3000} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  req.user = {
    _id: '644392bfbf64737d49e63f34' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))

app.use((req, res) => {
  setResponse({res, message: 'Страница не найдена', httpStatus: HTTP_404})
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})