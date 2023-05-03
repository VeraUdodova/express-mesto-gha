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

module.exports = {
  setResponse,
  HTTP_404,
  HTTP_200,
  HTTP_400,
  HTTP_500,
  HTTP_201,
};
