const HTTP_200 = 200;
const HTTP_201 = 201;
const HTTP_400 = 400;
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

const errorResponse = (res, errors) => {
  let httpStatus = HTTP_500;
  let { message } = errors;

  if (errors.name === 'ValidationError') {
    httpStatus = HTTP_400;
  } else if (errors.name === 'CastError') {
    httpStatus = HTTP_400;
    message = 'id некорректен';
  }

  setResponse({
    res,
    message,
    httpStatus,
  });
};

module.exports = {
  setResponse,
  errorResponse,
  HTTP_404,
  HTTP_200,
  HTTP_400,
  HTTP_500,
  HTTP_201,
};
