const { HTTP_400 } = require('../utils/utils');

class ValidationError extends Error {
  constructor(message = 'Ошибка валидации') {
    super(message);
    this.statusCode = HTTP_400;
  }
}

module.exports = ValidationError;
