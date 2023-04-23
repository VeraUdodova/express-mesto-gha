const { ObjectId } = require('mongoose').Types;

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

// const validateText = (text) => {
//   if (typeof text !== 'undefined' && text.length >= 2 && text.length <= 30) {
//     return true;
//   }
//
//   return [`${Object.keys({text})[0]}: не удовлетворят параметрам`]
// }
//
// const validateUrl = (url) => {
//   if (typeof url !== 'undefined' && url.length > 0) {
//     return true;
//   }
//
//   return [`${Object.keys({url})[0]}: не удовлетворят параметрам`]
// }

const errorResponse = (res, profile, errors) => {
  if (Object.keys(profile).length === 0) {
    errors.push('Ничего не передано');
  }

  if (errors.length > 0) {
    setResponse({
      res,
      message: errors,
      httpStatus: HTTP_400,
    });

    return false;
  }

  return true;
};

const validateId = (res, id) => {
  if (!ObjectId.isValid(id)) {
    setResponse({
      res, message: 'id некорректен', httpStatus: HTTP_400,
    });

    return false;
  }

  return true;
};

module.exports = {
  setResponse,
  errorResponse,
  validateId,
  HTTP_404,
  HTTP_200,
  HTTP_400,
  HTTP_500,
  HTTP_201,
};
