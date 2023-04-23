const setResponse = (
  {
    res,
    messageKey = 'message',
    message,
    httpStatus = 200
  }) => {
  if (httpStatus === 500 && typeof message === 'undefined') {
    message = 'На сервере произошла ошибка';
  }

  if (messageKey === 'message' && typeof message !== 'string') {
    message = message.join('\n')
  }

  return res.status(httpStatus).send({[messageKey]: message})
}

const validateText = (text) => {
  if (typeof text !== 'undefined' && text.length >= 2 && text.length <= 30) {
    return true;
  }

  return [`${Object.keys({text})[0]}: не удовлетворят параметрам`]
}

const validateUrl = (url) => {
  if (typeof url !== 'undefined' && url.length > 0) {
    return true;
  }

  return [`${Object.keys({url})[0]}: не удовлетворят параметрам`]
}

const errorResponse = (res, profile, errors) => {
  if (Object.keys(profile).length === 0) {
    errors.push('Ничего не передано')
  }

  if (errors.length > 0) {
    setResponse({
      res: res,
      message: errors,
      httpStatus: 400
    })

    return false
  }

  return true
}

module.exports = {
  setResponse, validateUrl, errorResponse, validateText
}