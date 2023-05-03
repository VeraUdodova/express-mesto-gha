const { HTTP_400 } = require('../utils/utils');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_400;
  }
}

module.exports = ValidationError;
