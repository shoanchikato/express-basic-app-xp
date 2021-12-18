class NotFoundError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
  }
}

class BadRequestError extends Error {
  constructor({ message = "", validation = "", reqBody = {}, args = [] }) {
    super(message, validation, reqBody, ...args);

    this.validation = validation;
    this.reqBody = reqBody;
  }
}

class UnauthorizedRequestError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
  }
}

class InternalServerError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
  }
}

module.exports = {
  NotFoundError,
  BadRequestError,
  UnauthorizedRequestError,
  InternalServerError,
};
