const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message, errors) {
    super(message, 400, errors);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
