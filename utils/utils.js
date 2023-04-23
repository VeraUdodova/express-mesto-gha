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
  return res.status(httpStatus).send({[messageKey]: message})
}
