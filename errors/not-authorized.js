const { HTTP_401 } = require('../utils/utils');

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_401;
  }
}

module.exports = NotAuthorizedError;
