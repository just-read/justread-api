class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class AlreadyExistsError extends CustomError {
  constructor(message: string, status = 409) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlreadyExistsError);
    }
  }
}

class NotFoundError extends CustomError {
  constructor(message: string, status = 404) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

class InvalidParamError extends CustomError {
  constructor(message: string, status = 400) {
    super(message, status);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidParamError);
    }
  }
}

export { AlreadyExistsError, NotFoundError, InvalidParamError };
