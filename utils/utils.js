const mongoose = require('mongoose');

const HTTP_200 = 200;
const HTTP_201 = 201;
const HTTP_400 = 400;
const HTTP_409 = 409;
const HTTP_401 = 401;
const HTTP_404 = 404;
const HTTP_500 = 500;

const setResponse = (
  {
    res,
    messageKey = 'message',
    message,
    httpStatus = HTTP_200,
  },
) => {
  let result;

  if (httpStatus === HTTP_500) {
    result = { [messageKey]: 'На сервере произошла ошибка' };
  } else if (messageKey === 'message' && typeof message !== 'string') {
    result = { [messageKey]: message.join('\n') };
  } else if (messageKey == null) {
    result = message;
  } else {
    result = { [messageKey]: message };
  }

  return res.status(httpStatus).send(result);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode = HTTP_500, message } = err;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = HTTP_400;
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = HTTP_400;
    message = 'запрос некорректен';
  } else if (err.code === 11000) {
    statusCode = HTTP_409;
    message = 'Такой пользователь уже есть';
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};

const urlRegExp = /https?:\/\/(?:|www.?)[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?/;

module.exports = {
  setResponse,
  errorHandler,
  urlRegExp,
  HTTP_200,
  HTTP_201,
  HTTP_400,
  HTTP_401,
  HTTP_404,
  HTTP_409,
  HTTP_500,
};
