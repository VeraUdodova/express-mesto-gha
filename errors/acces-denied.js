const { HTTP_403 } = require('../utils/utils');

class AccessDeniedError extends Error {
  constructor(message = 'Доступ запрещен') {
    super(message);
    this.statusCode = HTTP_403;
  }
}

module.exports = AccessDeniedError;
