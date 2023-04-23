module.exports.setResponse = (
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
